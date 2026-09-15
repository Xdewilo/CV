async function exportPDFExact() {
    const { jsPDF } = window.jspdf;
    const container = document.querySelector('.cv-container');
    if (!container) {
        return;
    }

    const button = document.querySelector('.download-button');
    if (button) {
        button.style.visibility = 'hidden';
    }

    try {
        const canvas = await html2canvas(container, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: container.scrollWidth,
            windowHeight: container.scrollHeight
        });

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = 210;
        const pageHeight = 297;

        let imgWidth = pageWidth;
        let imgHeight = (canvas.height * pageWidth) / canvas.width;

        if (imgHeight > pageHeight) {
            imgHeight = pageHeight;
            imgWidth = (canvas.width * pageHeight) / canvas.height;
        }

        const offsetX = (pageWidth - imgWidth) / 2;
        const offsetY = (pageHeight - imgHeight) / 2;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, imgWidth, imgHeight);

        const rawTitle = (document.title || 'CV').replace(/^CV\s*-\s*/i, '').trim() || 'CV';
        const fileName = `CV-${rawTitle.replace(/\s+/g, '-')}.pdf`;
        pdf.save(fileName);
    } finally {
        if (button) {
            button.style.visibility = '';
        }
    }
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 12;
    const lineHeight = 3.5;
    let currentY = margin;

    function addText(text, x, y, maxWidth, fontSize = 10, style = 'normal') {
        doc.setFontSize(fontSize);
        doc.setFont('times', style);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
    }

    function addCenteredText(text, y, fontSize = 10, style = 'normal') {
        doc.setFontSize(fontSize);
        doc.setFont('times', style);
        const textWidth = doc.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        doc.text(text, x, y);
        return y + lineHeight;
    }

    function addLine(y, thickness = 0.5) {
        doc.setLineWidth(thickness);
        doc.line(margin, y, pageWidth - margin, y);
        return y + 3;
    }

    currentY = addCenteredText('JEREMY POSADA', currentY + 6, 20, 'bold');
    currentY = addLine(currentY);
    currentY = addCenteredText('Software Engineer | Java Spring Boot | Angular | Microservices | Architecture', currentY + 1, 9, 'normal');

    const contactInfo = 'Barranquilla, Colombia • (+57) 3043620454 • jeremyposada2003@gmail.com • https://www.linkedin.com/in/jeremy-posada-56855820b';
    currentY = addCenteredText(contactInfo, currentY + 3, 9, 'normal');
    currentY += 6;

    currentY = addCenteredText('EDUCATION', currentY, 13, 'bold');
    currentY = addLine(currentY);

    currentY = addText('Ingeniero de Sistemas', margin, currentY + 3, pageWidth - 2 * margin, 11, 'bold');
    currentY = addText('INSTITUCIÓN UNIVERSITARIA AMERICANA', margin, currentY, pageWidth - 2 * margin, 9, 'italic');
    currentY = addText('2021 - 2026', margin, currentY, pageWidth - 2 * margin, 9, 'normal');
    currentY += 3;

    currentY = addText('Diplomado en C# .NET', margin, currentY, pageWidth - 2 * margin, 11, 'bold');
    currentY = addText('INSTITUCIÓN UNIVERSITARIA AMERICANA', margin, currentY, pageWidth - 2 * margin, 9, 'italic');
    currentY = addText('2 meses', margin, currentY, pageWidth - 2 * margin, 9, 'normal');
    currentY += 6;

    currentY = addCenteredText('PROFILE', currentY, 13, 'bold');
    currentY = addLine(currentY);

    const profileText = 'Estudiante de Ingenieria de Sistemas y Software Engineer con enfoque en backend, arquitectura de software y desarrollo full-stack. Experiencia construyendo microservicios con Java 21 y Spring Boot, aplicando arquitectura hexagonal, CQRS, DDD y patron Mediator en soluciones SaaS multi-tenant. En frontend trabajo con Angular, TypeScript, NGRx y Signals, alineando implementacion con mantenibilidad, responsividad y criterios de diseno.';
    currentY = addText(profileText, margin, currentY + 3, pageWidth - 2 * margin, 10, 'normal');
    currentY += 6;

    currentY = addCenteredText('CORE COMPETENCIES', currentY, 13, 'bold');
    currentY = addLine(currentY);

    const skills = [
        '• Arquitectura Hexagonal, DDD, CQRS y Clean Architecture',
        '• Microservicios con Java 21, Spring Boot y Spring Security',
        '• Apache Kafka, Redis y event-driven architecture',
        '• JWT, permisos granulares, RBAC y multitenancy',
        '• Angular, TypeScript, NGRx, RxJS y Signals',
        '• PostgreSQL avanzado, Flyway y modelado multi-schema',
        '• Docker, GitHub Actions, observabilidad y APIs REST',
        '• Figma, design systems y UI implementation responsiva'
    ];

    skills.forEach((skill) => {
        currentY = addText(skill, margin, currentY + 2, pageWidth - 2 * margin, 9.5, 'normal');
    });
    currentY += 5;

    currentY = addCenteredText('EXPERIENCE', currentY, 13, 'bold');
    currentY = addLine(currentY);

    currentY = addText('Junior Full Stack Developer', margin, currentY + 3, pageWidth - 2 * margin, 11, 'bold');
    currentY = addText('TIC LTDA', margin, currentY, pageWidth - 2 * margin, 9, 'italic');
    currentY = addText('03/2023 - 09/2023 · 7 meses', margin, currentY, pageWidth - 2 * margin, 8.5, 'normal');

    const exp1Items = [
        '• Migración de aplicaciones web de PHP a Laravel, mejorando la escalabilidad y organización del código',
        '• Consumo de APIs externas para el manejo y visualización de datos en tiempo real',
        '• Desarrollo de un módulo de generación de códigos de barras y guías de envío para empresas asociadas, como Triple AAA y Efigas'
    ];

    exp1Items.forEach((item) => {
        currentY = addText(item, margin + 5, currentY + 2, pageWidth - 2 * margin - 5, 9, 'normal');
    });
    currentY += 5;

    currentY = addText('Full Stack Software Engineer (Java/Spring Boot & Angular)', margin, currentY, pageWidth - 2 * margin, 11, 'bold');
    currentY = addText('EIDYKOS S.A.S (Remote, Barranquilla, Colombia)', margin, currentY, pageWidth - 2 * margin, 9, 'italic');
    currentY = addText('03/2025 - Present', margin, currentY, pageWidth - 2 * margin, 8.5, 'normal');

    const exp2Items = [
        '• Microservicios en Java 21/Spring Boot con arquitectura hexagonal, DDD, CQRS y patrón Mediator',
        '• Spring Security con JWT, BCrypt y permisos granulares (AOP) en entorno SaaS multi-tenant',
        '• Apache Kafka (26+ topics) y Redis para event-driven architecture, caché y sesiones distribuidas',
        '• PostgreSQL avanzado: multi-schema, JSONB, triggers, índices parciales, RLS y Flyway',
        '• Resilience4j (Circuit Breaker, Retry) y WebFlux/WebClient no-bloqueante',
        '• Arquitectura frontend: Angular, NGRx, Signals, RxJS, PrimeNG, vertical slicing y lineamientos de design system',
        '• Observabilidad con Spring Actuator, Prometheus, Grafana, Loki y Jaeger',
        '• Implementación de interfaces responsivas en colaboración con Figma y criterios de producto',
        '• Docker Compose (20+ servicios), Apache APISIX (API Gateway), MinIO (S3), GitHub Actions (CI/CD)'
    ];

    exp2Items.forEach((item) => {
        if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = margin;
        }

        currentY = addText(item, margin + 5, currentY + 2, pageWidth - 2 * margin - 5, 9, 'normal');
    });
    currentY += 5;

    if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = margin;
    }

    currentY = addCenteredText('TECHNOLOGIES', currentY, 13, 'bold');
    currentY = addLine(currentY);

    const technologies = [
        '• Backend: Java, Spring Boot',
        '• Frontend: Angular, TypeScript',
        '• Data: PostgreSQL, Redis, MySQL',
        '• Messaging: Apache Kafka',
        '• Infra: Docker, Docker Compose, GitHub Actions',
        '• API & Docs: REST APIs, Swagger/OpenAPI',
        '• Product/UI: Figma, Design Systems'
    ];

    technologies.forEach((tech) => {
        currentY = addText(tech, margin, currentY + 2, pageWidth - 2 * margin, 9.5, 'normal');
    });
    currentY += 5;

    currentY = addCenteredText('REFERENCES', currentY, 13, 'bold');
    currentY = addLine(currentY);

    currentY = addText('WALDIR, BONILLA', margin, currentY + 3, pageWidth - 2 * margin, 10, 'bold');
    currentY = addText('Director de proyectos de TIC LTDA, +57 3014177306, TIC LTDA', margin, currentY, pageWidth - 2 * margin, 9, 'normal');

    doc.save('CV-Jeremy-Posada.pdf');
}

const PDF_FILENAMES = {
    'index.html': 'CV-Jeremy-Posada.pdf',
    'index2.html': 'CV-Nellis-Zapata.pdf',
    'index3.html': 'CV-Karen-Zapata.pdf',
    'index4.html': 'CV-Karen-Zapata-ATS.pdf'
};

function getCurrentSourceFile() {
    const path = window.location.pathname || '';
    const last = path.split('/').pop() || '';
    if (PDF_FILENAMES[last]) {
        return last;
    }
    return 'index.html';
}

async function exportPDFBackend() {
    const sourceFile = getCurrentSourceFile();
    const downloadName = PDF_FILENAMES[sourceFile] || 'CV.pdf';

    try {
        const response = await fetch(`/export-pdf?file=${encodeURIComponent(sourceFile)}`);
        if (!response.ok) {
            throw new Error('Export failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = downloadName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        if (typeof exportPDFExact === 'function') {
            await exportPDFExact();
        } else {
            downloadPDF();
        }
    }
}

function printCV() {
    window.print();
}

function setupPrint() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('print') === 'true') {
        printCV();
    }
}

function formatMonthYearATS(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
}

function formatExperienceDurations() {
    document.querySelectorAll('.experience-item').forEach((item) => {
        const start = item.getAttribute('data-start');
        const end = item.getAttribute('data-end');
        const durationElement = item.querySelector('.duration');

        if (!start || !end || !durationElement) {
            return;
        }

        const [startYear, startMonth] = start.split('-');
        const startDate = new Date(Number(startYear), Number(startMonth) - 1, 1);

        let endDate;
        if (end === 'current') {
            endDate = new Date();
        } else {
            const [endYear, endMonth] = end.split('-');
            endDate = new Date(Number(endYear), Number(endMonth) - 1, 1);
        }

        const months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) +
            1;

        const startLabel = formatMonthYearATS(startDate);
        const endLabel = end === 'current' ? 'Present' : formatMonthYearATS(endDate);
        durationElement.innerHTML = `${startLabel} - ${endLabel} · ${months} meses`;
    });
}

function formatEducationDurations() {
    document.querySelectorAll('.education-item').forEach((item) => {
        const start = item.getAttribute('data-start');
        const end = item.getAttribute('data-end');
        const durationElement = item.querySelector('.edu-duration');
        const degreeElement = item.querySelector('.degree');

        if (!start || !end || !durationElement || !degreeElement) {
            return;
        }

        const [startYear, startMonth] = start.split('-');
        const startDate = new Date(Number(startYear), Number(startMonth) - 1, 1);

        const isCurrent = end === 'current';
        const endDate = isCurrent
            ? new Date()
            : new Date(Number(end.split('-')[0]), Number(end.split('-')[1]) - 1, 1);

        const months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) +
            1;

        const degreeText = degreeElement.textContent.toLowerCase();
        if (degreeText.includes('diplom')) {
            durationElement.textContent = `${months} meses`;
            return;
        }

        const endLabel = isCurrent ? 'En curso' : endDate.getFullYear();
        durationElement.textContent = `${startDate.getFullYear()} - ${endLabel}`;
    });
}

window.addEventListener('load', () => {
    setupPrint();
    formatExperienceDurations();
    formatEducationDurations();
});