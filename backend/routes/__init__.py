"""路由初始化"""
from flask import Blueprint

# 创建蓝图
todo_bp = Blueprint('todos', __name__, url_prefix='/api/todos')
category_bp = Blueprint('categories', __name__, url_prefix='/api/categories')
pomodoro_bp = Blueprint('pomodoro', __name__, url_prefix='/api/pomodoro')

# 导入路由处理函数（避免循环导入）
def register_routes(app):
    from routes import todo_routes, category_routes, pomodoro_routes
    
    app.register_blueprint(todo_routes.todo_bp)
    app.register_blueprint(category_routes.category_bp)
    app.register_blueprint(pomodoro_routes.pomodoro_bp)
