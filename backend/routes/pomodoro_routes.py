"""番茄钟路由"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from database import db
from models import PomodoroRecord, Todo

pomodoro_bp = Blueprint('pomodoro', __name__, url_prefix='/api/pomodoro')


@pomodoro_bp.route('', methods=['POST'])
def record_pomodoro():
    """记录番茄钟"""
    try:
        data = request.get_json()
        
        record = PomodoroRecord(
            todo_id=data.get('todo_id'),
            duration=data.get('duration', 25)
        )
        
        db.session.add(record)
        
        # 更新待办的专注时间
        if data.get('todo_id'):
            todo = Todo.query.get(data['todo_id'])
            if todo:
                todo.focus_time = (todo.focus_time or 0) + data.get('duration', 25)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': record.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@pomodoro_bp.route('/today', methods=['GET'])
def get_today_stats():
    """获取今日统计"""
    try:
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        records = PomodoroRecord.query.filter(
            PomodoroRecord.completed_at >= today
        ).all()
        
        total_minutes = sum(record.duration for record in records)
        
        return jsonify({
            'success': True,
            'data': {
                'count': len(records),
                'total_minutes': total_minutes,
                'records': [record.to_dict() for record in records]
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@pomodoro_bp.route('/history', methods=['GET'])
def get_history_stats():
    """获取历史统计"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = PomodoroRecord.query
        
        if start_date:
            start = datetime.fromisoformat(start_date)
            query = query.filter(PomodoroRecord.completed_at >= start)
        
        if end_date:
            end = datetime.fromisoformat(end_date)
            query = query.filter(PomodoroRecord.completed_at <= end)
        
        records = query.all()
        
        total_minutes = sum(record.duration for record in records)
        
        # 按日期分组统计
        daily_stats = {}
        for record in records:
            date = record.completed_at.strftime('%Y-%m-%d')
            if date not in daily_stats:
                daily_stats[date] = {'count': 0, 'minutes': 0}
            daily_stats[date]['count'] += 1
            daily_stats[date]['minutes'] += record.duration
        
        return jsonify({
            'success': True,
            'data': {
                'total_count': len(records),
                'total_minutes': total_minutes,
                'daily_stats': daily_stats
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
