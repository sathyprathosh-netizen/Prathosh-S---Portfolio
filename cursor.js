/* ============================================================
   Custom Cursor Logic — js/cursor.js
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("custom-cursor");
    if (!cursor) return;
    
    const cursorText = cursor.querySelector(".cursor-text");
    
    // Check if device supports hover
    if (window.matchMedia("(pointer: coarse)").matches) {
        cursor.style.display = "none";
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let speed = 0.2; // Spring speed
    let isCursorActive = false;

    // Setup mouse movement
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isCursorActive) {
            cursor.classList.add("active");
            isCursorActive = true;
        }
    });

    // Animation loop for fluid cursor movement
    function animateCursor() {
        let distX = mouseX - cursorX;
        let distY = mouseY - cursorY;
        
        cursorX = cursorX + (distX * speed);
        cursorY = cursorY + (distY * speed);
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const applyHoverState = () => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, label, .img-upload-label');
        interactiveElements.forEach(el => {
            // Avoid duplicate listeners
            if (el.dataset.cursorHovered === 'true') return;
            el.dataset.cursorHovered = 'true';
            
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.background = 'var(--accent-light)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'var(--text)';
            });
        });
    }

    // Hover state for Project Cards (reveal text)
    const initProjectHover = () => {
        applyHoverState(); // re-apply standard hovers for new elements
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            if (card.dataset.projectHovered === 'true') return;
            card.dataset.projectHovered = 'true';
            
            card.addEventListener('mouseenter', () => {
                cursor.style.width = '120px';
                cursor.style.height = '120px';
                cursor.style.background = 'var(--text)';
                cursor.style.mixBlendMode = 'normal'; // Reset blend mode to show text properly
                if(cursorText) cursorText.style.opacity = '1';
            });
            card.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'var(--text)';
                cursor.style.mixBlendMode = 'difference';
                if(cursorText) cursorText.style.opacity = '0';
            });
        });
    };
    
    initProjectHover();
    window.initProjectHover = initProjectHover;
});
