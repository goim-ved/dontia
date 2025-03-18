document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or respect OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        // Update icon
        if (body.classList.contains('dark-theme')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Collapsible sections
    const toggleButtons = document.querySelectorAll('.toggle-section');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.topic-section');
            const content = section.querySelector('.section-content');
            const icon = this.querySelector('i');
            
            // Toggle content visibility
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            
            // Toggle icon
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.sidebar nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90, // Accounting for header
                    behavior: 'smooth'
                });
                
                // Expand section if collapsed
                const sectionContent = targetElement.querySelector('.section-content');
                const toggleButton = targetElement.querySelector('.toggle-section i');
                
                if (sectionContent.style.display === 'none') {
                    sectionContent.style.display = 'block';
                    toggleButton.classList.remove('fa-chevron-down');
                    toggleButton.classList.add('fa-chevron-up');
                }
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const sections = document.querySelectorAll('.topic-section');
        
        if (searchTerm.length < 2) {
            // Reset visibility if search term is too short
            sections.forEach(section => {
                section.style.display = 'block';
                highlightText(section, '');
            });
            return;
        }
        
        sections.forEach(section => {
            const sectionText = section.textContent.toLowerCase();
            const sectionContent = section.querySelector('.section-content');
            
            if (sectionText.includes(searchTerm)) {
                section.style.display = 'block';
                sectionContent.style.display = 'block';
                section.querySelector('.toggle-section i').classList.remove('fa-chevron-down');
                section.querySelector('.toggle-section i').classList.add('fa-chevron-up');
                highlightText(section, searchTerm);
            } else {
                section.style.display = 'none';
            }
        });
    });
    
    // Function to highlight search terms
    function highlightText(element, term) {
        if (!term) {
            // Remove all highlights
            const highlights = element.querySelectorAll('mark');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
            return;
        }
        
        const textNodes = getTextNodes(element);
        
        textNodes.forEach(node => {
            const text = node.nodeValue.toLowerCase();
            const parent = node.parentNode;
            
            if (text.includes(term) && parent.nodeName !== 'MARK') {
                const regex = new RegExp(`(${term})`, 'gi');
                const newHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
                
                const tempElement = document.createElement('div');
                tempElement.innerHTML = newHTML;
                
                const fragment = document.createDocumentFragment();
                while (tempElement.firstChild) {
                    fragment.appendChild(tempElement.firstChild);
                }
                
                parent.replaceChild(fragment, node);
            }
        });
    }
    
    // Helper function to get all text nodes
    function getTextNodes(element) {
        const textNodes = [];
        const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        
        let node;
        while (node = walk.nextNode()) {
            if (node.nodeValue.trim() !== '') {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }
    
    // MathJax config for responsive equations
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process'
        },
        startup: {
            pageReady() {
                return MathJax.startup.defaultPageReady().then(function() {
                    // Ensure MathJax is properly sized on mobile
                    const mathElements = document.querySelectorAll('.math');
                    mathElements.forEach(el => {
                        el.style.overflow = 'auto';
                    });
                });
            }
        }
    };
});