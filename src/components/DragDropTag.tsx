import React from 'react';
import { useDrag } from 'react-dnd';
import { Tag } from '../types';

interface DragDropTagProps {
  tag: Tag;
  isSelected: boolean;
  onClick: (tag: Tag) => void;
}

const DragDropTag: React.FC<DragDropTagProps> = ({ tag, isSelected, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'tag',
    item: tag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      className={`tag ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(tag)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span>{tag.icon}</span>
      <span>{tag.name}</span>
    </button>
  );
};

export default DragDropTag;
