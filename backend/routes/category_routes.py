"""分类路由"""
from flask import Blueprint, request, jsonify
from datetime import datetime
from database import db
from models import Category, Todo

category_bp = Blueprint('categories', __name__, url_prefix='/api/categories')


@category_bp.route('', methods=['GET'])
def get_all_categories():
    """获取所有分类"""
    try:
        categories = Category.query.order_by(Category.created_at.desc()).all()
        
        # 如果没有分类，创建默认分类
        if len(categories) == 0:
            default_categories = [
                {'name': '工作', 'color': '#3498db', 'icon': 'work'},
                {'name': '生活', 'color': '#2ecc71', 'icon': 'life'},
                {'name': '学习', 'color': '#9b59b6', 'icon': 'study'},
                {'name': '其他', 'color': '#95a5a6', 'icon': 'other'}
            ]
            
            for cat_data in default_categories:
                category = Category(
                    name=cat_data['name'],
                    color=cat_data['color'],
                    icon=cat_data['icon'],
                    is_default=True
                )
                db.session.add(category)
            db.session.commit()
            
            categories = Category.query.all()
        
        return jsonify({
            'success': True,
            'data': [category.to_dict() for category in categories]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@category_bp.route('', methods=['POST'])
def create_category():
    """创建分类"""
    try:
        data = request.get_json()
        
        category = Category(
            name=data.get('name'),
            color=data.get('color', '#3498db'),
            icon=data.get('icon', 'other'),
            is_default=False
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': category.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@category_bp.route('/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """更新分类"""
    try:
        category = Category.query.get_or_404(category_id)
        data = request.get_json()
        
        if 'name' in data:
            category.name = data['name']
        if 'color' in data:
            category.color = data['color']
        if 'icon' in data:
            category.icon = data['icon']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': category.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@category_bp.route('/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """删除分类"""
    try:
        category = Category.query.get_or_404(category_id)
        
        # 不允许删除默认分类
        if category.is_default:
            return jsonify({
                'success': False,
                'error': '不能删除默认分类'
            }), 400
        
        # 将该分类下的待办设为"其他"分类
        other_category = Category.query.filter_by(name='其他', is_default=True).first()
        if other_category:
            todos = Todo.query.filter_by(category_id=category_id).all()
            for todo in todos:
                todo.category_id = other_category.id
            db.session.commit()
        
        db.session.delete(category)
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
