import React from 'react';
import jsPDF from 'jspdf';
import { Route } from '../types';

interface PDFExporterProps {
  route: Route | null;
  onExport: () => void;
}

const PDFExporter: React.FC<PDFExporterProps> = ({ route, onExport }) => {
  const generatePDF = async () => {
    if (!route) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Заголовок
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Путеводитель по Саратову', pageWidth / 2, 30, { align: 'center' });

    // Информация о маршруте
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(route.name, margin, 50);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Расстояние: ${route.distance.toFixed(1)} км`, margin, 60);
    pdf.text(`Время прохождения: ${Math.round(route.duration)} минут`, margin, 70);
    pdf.text(`Сложность: ${route.difficulty === 'easy' ? 'Легкий' : 
                            route.difficulty === 'medium' ? 'Средний' : 'Сложный'}`, margin, 80);

    let yPosition = 100;

    // Места маршрута
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Места для посещения:', margin, yPosition);
    yPosition += 15;

    route.places.forEach((place, index) => {
      // Проверяем, не выходим ли за пределы страницы
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 30;
      }

      // Номер и название места
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${place.name}`, margin, yPosition);
      yPosition += 10;

      // Описание
      pdf.setFont('helvetica', 'normal');
      const descriptionLines = pdf.splitTextToSize(place.description, pageWidth - 2 * margin);
      pdf.text(descriptionLines, margin + 5, yPosition);
      yPosition += descriptionLines.length * 5 + 5;

      // Рейтинг
      const stars = '★'.repeat(Math.floor(place.rating)) + '☆'.repeat(5 - Math.floor(place.rating));
      pdf.text(`Рейтинг: ${stars} (${place.rating}/5)`, margin + 5, yPosition);
      yPosition += 8;

      // Контактная информация
      if (place.businessInfo) {
        if (place.businessInfo.phone) {
          pdf.text(`Телефон: ${place.businessInfo.phone}`, margin + 5, yPosition);
          yPosition += 6;
        }
        if (place.businessInfo.workingHours) {
          pdf.text(`Режим работы: ${place.businessInfo.workingHours}`, margin + 5, yPosition);
          yPosition += 6;
        }
        if (place.businessInfo.website) {
          pdf.text(`Сайт: ${place.businessInfo.website}`, margin + 5, yPosition);
          yPosition += 6;
        }
      }

      yPosition += 10;
    });

    // QR-код для мобильной версии (симуляция)
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('QR-код для мобильной версии:', margin, yPosition);
    yPosition += 20;

    // Рисуем простой QR-код (в реальном приложении использовался бы настоящий QR-код)
    const qrSize = 40;
    pdf.rect(margin, yPosition, qrSize, qrSize);
    pdf.setFontSize(8);
    pdf.text('QR-код', margin + qrSize/2, yPosition + qrSize/2, { align: 'center' });

    pdf.setFontSize(10);
    pdf.text('Отсканируйте для открытия маршрута на телефоне', margin + qrSize + 10, yPosition + qrSize/2);

    // Футер
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(
      'Создано с помощью приложения "Собери свой Саратов"',
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );

    // Сохраняем PDF
    pdf.save(`${route.name.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.pdf`);
    onExport();
  };

  const shareRoute = () => {
    if (!route) return;

    const shareData = {
      title: route.name,
      text: `Посмотрите мой маршрут по Саратову: ${route.places.length} мест, ${route.distance.toFixed(1)} км`,
      url: window.location.href + `?route=${route.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback для браузеров без поддержки Web Share API
      const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Ссылка скопирована в буфер обмена!');
      });
    }
  };

  if (!route) return null;

  return (
    <div className="export-buttons">
      <button className="export-btn export-pdf" onClick={generatePDF}>
        📄 Скачать PDF
      </button>
      <button className="export-btn export-share" onClick={shareRoute}>
        📤 Поделиться
      </button>
    </div>
  );
};

export default PDFExporter;
