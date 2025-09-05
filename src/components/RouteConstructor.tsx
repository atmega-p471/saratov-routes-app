import React from 'react';
import { useDrop } from 'react-dnd';
import { Tag } from '../types';
import DragDropTag from './DragDropTag';

interface RouteConstructorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onGenerateRoute: () => void;
  allTags: Tag[];
}

const RouteConstructor: React.FC<RouteConstructorProps> = ({
  selectedTags,
  onTagsChange,
  onGenerateRoute,
  allTags
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tag',
    drop: (item: Tag) => {
      if (!selectedTags.find(t => t.id === item.id)) {
        onTagsChange([...selectedTags, item]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleTagClick = (tag: Tag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(t => t.id !== tagId));
  };

  const tagsByCategory = {
    personalities: allTags.filter(t => t.category === 'personalities'),
    themes: allTags.filter(t => t.category === 'themes'),
    formats: allTags.filter(t => t.category === 'formats'),
  };

  return (
    <div className="card route-constructor">
      <h2 className="section-title">🎯 Конструктор маршрутов</h2>
      
      <div className="tags-section">
        <div className="tags-category">
          <h3 className="category-title">👤 Персоналии</h3>
          <div className="tags-grid">
            {tagsByCategory.personalities.map(tag => (
              <DragDropTag
                key={tag.id}
                tag={tag}
                isSelected={selectedTags.some(t => t.id === tag.id)}
                onClick={handleTagClick}
              />
            ))}
          </div>
        </div>

        <div className="tags-category">
          <h3 className="category-title">🎨 Темы</h3>
          <div className="tags-grid">
            {tagsByCategory.themes.map(tag => (
              <DragDropTag
                key={tag.id}
                tag={tag}
                isSelected={selectedTags.some(t => t.id === tag.id)}
                onClick={handleTagClick}
              />
            ))}
          </div>
        </div>

        <div className="tags-category">
          <h3 className="category-title">⚡ Формат</h3>
          <div className="tags-grid">
            {tagsByCategory.formats.map(tag => (
              <DragDropTag
                key={tag.id}
                tag={tag}
                isSelected={selectedTags.some(t => t.id === tag.id)}
                onClick={handleTagClick}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={drop}
        className={`drop-zone ${isOver ? 'active' : ''}`}
      >
        {selectedTags.length === 0 ? (
          <div>
            <p>🎯 Перетащите теги сюда или нажмите на них</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>
              Выберите интересующие вас места и темы для создания уникального маршрута
            </p>
          </div>
        ) : (
          <div>
            <p>✨ Выбранные интересы:</p>
            <div className="selected-tags">
              {selectedTags.map(tag => (
                <div
                  key={tag.id}
                  className="tag selected"
                  onClick={() => removeTag(tag.id)}
                  style={{ cursor: 'pointer' }}
                  title="Нажмите, чтобы удалить"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.name}</span>
                  <span>×</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        className="generate-btn"
        onClick={onGenerateRoute}
        disabled={selectedTags.length === 0}
      >
        🗺️ Создать маршрут
      </button>

      {selectedTags.length > 0 && (
        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
          💡 Система автоматически подберет места, соответствующие вашим интересам,
          и построит оптимальный пешеходный маршрут
        </div>
      )}
    </div>
  );
};

export default RouteConstructor;
