"""数据模型定义"""
from database import db, BaseModel
from datetime import datetime


class Category(BaseModel):
    """分类模型"""
    __tablename__ = 'categories'
    
    name = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(7), default='#3498db')  # 十六进制颜色
    icon = db.Column(db.String(50), default='other')
    is_default = db.Column(db.Boolean, default=False)
    
    # 关联的待办事项
    todos = db.relationship('Todo', backref='category', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'color': self.color,
            'icon': self.icon,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Todo(BaseModel):
    """待办事项模型"""
    __tablename__ = 'todos'
    
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, default='')
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    priority = db.Column(db.String(10), default='medium')  # high, medium, low
    due_date = db.Column(db.DateTime, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    focus_time = db.Column(db.Integer, default=0)  # 专注时间（分钟）
    
    # 关联的番茄钟记录
    pomodoro_records = db.relationship('PomodoroRecord', backref='todo', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category_id': self.category_id,
            'category': self.category.to_dict() if self.category else None,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completed': self.completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'focus_time': self.focus_time,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class PomodoroRecord(BaseModel):
    """番茄钟记录模型"""
    __tablename__ = 'pomodoro_records'
    
    todo_id = db.Column(db.Integer, db.ForeignKey('todos.id'), nullable=True)
    duration = db.Column(db.Integer, default=25)  # 时长（分钟）
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'todo_id': self.todo_id,
            'duration': self.duration,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
