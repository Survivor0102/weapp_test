"""待办事项路由"""
from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from models import Todo

todo_bp = Blueprint('todos', __name__, url_prefix='/api/todos')


@todo_bp.route('', methods=['GET'])
def get_all_todos():
    """获取所有待办事项"""
    try:
        todos = Todo.query.order_by(Todo.created_at.desc()).all()
        return jsonify({
            'success': True,
            'data': [todo.to_dict() for todo in todos]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@todo_bp.route('', methods=['POST'])
def create_todo():
    """创建待办事项"""
    try:
        data = request.get_json()
        
        todo = Todo(
            title=data.get('title'),
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            priority=data.get('priority', 'medium'),
            due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None
        )
        
        db.session.add(todo)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': todo.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@todo_bp.route('/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """获取单个待办事项"""
    try:
        todo = Todo.query.get_or_404(todo_id)
        return jsonify({
            'success': True,
            'data': todo.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@todo_bp.route('/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """更新待办事项"""
    try:
        todo = Todo.query.get_or_404(todo_id)
        data = request.get_json()
        
        if 'title' in data:
            todo.title = data['title']
        if 'description' in data:
            todo.description = data['description']
        if 'category_id' in data:
            todo.category_id = data['category_id']
        if 'priority' in data:
            todo.priority = data['priority']
        if 'due_date' in data:
            todo.due_date = datetime.fromisoformat(data['due_date']) if data['due_date'] else None
        if 'completed' in data:
            todo.completed = data['completed']
            if data['completed']:
                todo.completed_at = datetime.utcnow()
            else:
                todo.completed_at = None
        if 'focus_time' in data:
            todo.focus_time = data['focus_time']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': todo.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@todo_bp.route('/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """删除待办事项"""
    try:
        todo = Todo.query.get_or_404(todo_id)
        db.session.delete(todo)
        db.session.commit()
        
        return jsonify({
            'success': True
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@todo_bp.route('/stats', methods=['GET'])
def get_stats():
    """获取待办统计"""
    try:
        total = Todo.query.count()
        completed = Todo.query.filter_by(completed=True).count()
        active = total - completed
        
        return jsonify({
            'success': True,
            'data': {
                'total': total,
                'completed': completed,
                'active': active
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
