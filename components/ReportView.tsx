
import React, { useState } from 'react';
import type { User, Activity } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { LogoIcon } from './icons/Logo';
import { ArrowLeftIcon } from './icons/ArrowLeft';
import { FOOTER_TEXT, APP_NAME } from '../constants';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import { Spinner } from './ui/Spinner';

interface ReportViewProps {
  user: User;
  activities: Activity[];
  onBack: () => void;
}

// Helper function for text wrapping
const wrapText = (text: string, font: any, size: number, maxWidth: number): string[] => {
    const lines: string[] = [];
    if (!text) return lines;

    const words = text.split(' ');
    let currentLine = '';
    for (const word of words) {
        const potentialLine = currentLine === '' ? word : `${currentLine} ${word}`;
        const width = font.widthOfTextAtSize(potentialLine, size);
        if (width > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = potentialLine;
        }
    }
    lines.push(currentLine);
    return lines;
};

const ReportView: React.FC<ReportViewProps> = ({ user, activities, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const completedActivities = activities.filter(a => a.completed);
  
  const handleDownloadReport = async () => {
    setIsGenerating(true);
    try {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();
        
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        const primaryColor = rgb(0.29, 0.78, 0.89); // approx cyan-400
        const textColor = rgb(0.1, 0.1, 0.1);
        const grayColor = rgb(0.4, 0.4, 0.4);
        const correctColor = rgb(0.22, 0.6, 0.33); // approx green-600
        const incorrectColor = rgb(0.8, 0.2, 0.2); // approx red-600

        const margin = 50;
        let y = height - margin;

        const drawFooter = (currentPage: any) => {
             currentPage.drawText(FOOTER_TEXT, {
                x: margin,
                y: margin / 2,
                font,
                size: 8,
                color: grayColor,
            });
        };

        // --- Header ---
        if (user.profilePic) {
            try {
                const imageBytes = await fetch(user.profilePic).then(res => res.arrayBuffer());
                 // Check if it's a PNG or JPEG
                const isPng = user.profilePic.startsWith('data:image/png');
                const image = isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);

                const imageDim = 60;
                page.drawImage(image, {
                    x: margin,
                    y: y - imageDim,
                    width: imageDim,
                    height: imageDim,
                });
            } catch(e){ console.error("Could not embed profile picture", e); }
        }

        page.drawText(APP_NAME, { x: width - margin - 100, y: y - 20, font: boldFont, size: 24, color: primaryColor });
        page.drawText('Reporte de Progreso', { x: width - margin - 145, y: y - 40, font, size: 14, color: grayColor });
        
        y -= 80;

        page.drawText(user.name, { x: margin, y, font: boldFont, size: 18, color: textColor });
        y -= 18;
        page.drawText(user.course, { x: margin, y, font, size: 12, color: grayColor });
        y -= 12;
        page.drawText(`Fecha: ${new Date().toLocaleDateString()}`, { x: margin, y, font, size: 12, color: grayColor });
        
        y -= 30;
        page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: primaryColor });
        y -= 30;

        // --- Summary ---
        page.drawText('Resumen de Actividades', { x: margin, y, font: boldFont, size: 16, color: textColor });
        y -= 25;
        page.drawText(`- Puntos Totales: ${user.points}`, { x: margin + 10, y, font, size: 12, color: grayColor });
        y -= 18;
        page.drawText(`- Nivel Actual: ${user.level}`, { x: margin + 10, y, font, size: 12, color: grayColor });
        y -= 18;
        page.drawText(`- Actividades Completadas: ${completedActivities.length} de ${activities.length}`, { x: margin + 10, y, font, size: 12, color: grayColor });

        y -= 40;

        // --- Activities Details ---
        for (const activity of completedActivities) {
            let neededHeight = 40;
            if (y - neededHeight < margin) {
                drawFooter(page);
                page = pdfDoc.addPage(PageSizes.A4);
                y = height - margin;
            }
            page.drawText(activity.title, { x: margin, y, font: boldFont, size: 14, color: textColor });
            y -= 20;
            page.drawText(`Calificación: ${activity.score / 10} / ${activity.totalQuestions}`, { x: margin + 10, y, font, size: 11, color: grayColor });
            y -= 25;

            for (let i = 0; i < activity.questions.length; i++) {
                const question = activity.questions[i];
                const userAnswer = activity.userAnswers[i];
                const isCorrect = userAnswer === question.correctAnswer;

                const questionLines = wrapText(`${i + 1}. ${question.questionText}`, font, 10, width - margin * 2);
                const answerLines = wrapText(`Tu respuesta: ${userAnswer || 'No respondida'}`, font, 10, width - margin * 2 - 10);
                const correctLines = isCorrect ? [] : wrapText(`Respuesta correcta: ${question.correctAnswer}`, font, 10, width - margin * 2 - 10);

                neededHeight = (questionLines.length + answerLines.length + correctLines.length) * 12 + 10;
                if (y - neededHeight < margin) {
                    drawFooter(page);
                    page = pdfDoc.addPage(PageSizes.A4);
                    y = height - margin;
                }

                for(const line of questionLines){
                    page.drawText(line, { x: margin, y, font, size: 10, color: textColor });
                    y -= 12;
                }
                
                for(const line of answerLines){
                    page.drawText(line, { x: margin + 10, y, font, size: 10, color: isCorrect ? correctColor : incorrectColor });
                    y -= 12;
                }

                if (!isCorrect) {
                   for(const line of correctLines){
                        page.drawText(line, { x: margin + 10, y, font, size: 10, color: grayColor });
                        y -= 12;
                   }
                }
                y -= 10;
            }
            y-= 20;
        }
        
        drawFooter(page);

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_eduquest_${user.name.replace(/\s/g, '_')}.pdf`;
        link.click();
    } catch(err) {
        console.error("Failed to generate PDF", err);
        alert("Hubo un error al generar el PDF. Por favor, intenta de nuevo.");
    } finally {
        setIsGenerating(false);
    }
  };
  
  return (
    <div>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            Volver al Dashboard
        </button>
        <Card className="max-w-4xl mx-auto">
            <div className="p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Tu Reporte de Progreso</h1>
                        <p className="text-slate-400 mt-2">Aquí puedes ver un resumen de tu increíble viaje de aprendizaje.</p>
                    </div>
                    <LogoIcon className="h-12 w-12 text-cyan-400 flex-shrink-0" />
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 rounded-lg">
                    <h2 className="text-xl font-bold text-white">Estudiante</h2>
                    <div className="flex items-center gap-4 mt-4">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                                <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-lg text-white">{user.name}</p>
                            <p className="text-slate-400">{user.course}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-6 bg-slate-900/50 rounded-lg">
                    <h2 className="text-xl font-bold text-white">Resumen de Actividades</h2>
                    <ul className="mt-4 space-y-3">
                        {completedActivities.length > 0 ? completedActivities.map(activity => (
                             <li key={activity.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-md">
                                <span className="text-slate-300">{activity.title}</span>
                                <span className="font-bold text-cyan-400">
                                    {activity.score / 10} / {activity.totalQuestions} Correctas
                                </span>
                            </li>
                        )) : (
                            <p className="text-slate-500 text-center py-4">Aún no has completado ninguna actividad. ¡Vamos, tú puedes!</p>
                        )}
                    </ul>
                </div>
                
                <div className="mt-8 text-center">
                    <Button onClick={handleDownloadReport} disabled={isGenerating || completedActivities.length === 0}>
                        {isGenerating ? (
                            <div className="flex items-center gap-2">
                                <Spinner /> Generando PDF...
                            </div>
                        ) : 'Descargar Reporte (PDF)'}
                    </Button>
                     {completedActivities.length === 0 && <p className="text-xs text-slate-500 mt-2">Completa al menos una actividad para descargar tu reporte.</p>}
                </div>
            </div>
        </Card>
    </div>
  );
};

export default ReportView;
