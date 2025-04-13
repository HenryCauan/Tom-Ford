gsap.registerPlugin(ScrollTrigger);

// Seleciona apenas os elementos dentro da seção 2 que precisam ser animados
const indices = document.querySelectorAll(".section2 .index");
const progressBarContainer = document.querySelector(".section2 .progress-bar");
const progressBar = document.querySelector(".section2 .progress");
const indicesContainer = document.querySelector(".section2 .indices");

const indexCount = indices.length;
const pinnedHeight = window.innerHeight * indexCount;

function animateIndices(progress) {
    const currentText = Math.floor(progress * indexCount);
    indices.forEach((index, i) => {
        gsap.to(index, {
            opacity: i <= currentText ? 1 : 0,
            duration: 0.3,
            ease: "power2.out",
        });
    });
}

function showProgressAndIndices() {
    gsap.to([progressBarContainer, indicesContainer], {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
    });
}

function hideProgressAndIndices() {
    gsap.to([progressBarContainer, indicesContainer], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
    });
}

// ScrollTrigger modificado: Observe que o 'trigger' agora é '.section2' e não '.pinned'
ScrollTrigger.create({
    trigger: ".section2", // Gatilho específico para a seção 2
    start: "top top", // Começa a animação quando o topo da seção 2 entra na viewport
    end: `+=${pinnedHeight}`, // Termina a animação após uma altura específica da seção 2
    pin: true, // Ativa o efeito de pin
    pinSpacing: true, // Define o comportamento do pinSpacing
    onLeave: hideProgressAndIndices,
    onEnterBack: showProgressAndIndices,
    onUpdate: (self) => {
        const progress = self.progress * indexCount;
        const progressHeight = Math.max(0, progress * 100);
        gsap.to(progressBar, {
            height: `${progressHeight}%`,
            duration: 0.3,
            ease: "power1.out",
        });
        animateIndices(self.progress);
    },
});

// Calcula a altura necessária para a section2 (após as animações)
function calculateSection2Height() {
    // Esta função deve calcular a altura final do conteúdo da section2.
    const pinnedSection = document.querySelector(".section2 .pinned");
    let height = pinnedSection.offsetHeight; // Obtém a altura do elemento pinned

    // Adicione um valor para evitar sobreposição:
    const buffer = 50; // Adiciona 50 pixels de buffer
    height += buffer;

    return height;
}

// Define a altura da section2 após as animações completarem
gsap.to(".section2", {
    duration: 0,
    height: calculateSection2Height(),
    onComplete: () => {
        ScrollTrigger.refresh();
        console.log("Altura da section2 atualizada");
    },
});

// Inicialização das animações
animateIndices(0);
showProgressAndIndices();

///////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        lerp: 0.1,
        smooth: true,
        direction: "vertical",
        mousewheel: true, // Ativa o suporte para roda do mouse
        touch: true, // Ativa o suporte para toque (se necessário)
    });

    lenis.on("scroll", (e) => {
        ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.registerPlugin(ScrollTrigger);

    const stickySection = document.querySelector(".sticky");
    const stickyHeader = document.querySelector(".sticky-header");
    const cards = document.querySelectorAll(".card");

    let stickyHeight = 0;
    cards.forEach((card) => (stickyHeight += card.offsetHeight));

    const transform = [
        [
            [10, 50, -10, 10],
            [20, -10, -45, 20],
        ],
        [
            [0, 47.5, -10, 15],
            [-25, 15, -45, 30],
        ],
        [
            [0, 52.5, -10, 5],
            [15, -5, -40, 60],
        ],
        [
            [0, 50, 30, -80],
            [20, -10, 60, 5],
        ],
        [
            [0, 55, -15, 30],
            [25, -15, 60, 95],
        ],
        // ... (seu array de transformações) ...
    ];

    ScrollTrigger.create({
        trigger: stickySection,
        start: "top top",
        end: `+=${stickyHeight}px`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const maxTranslate = stickyHeader.offsetWidth - window.innerWidth;
            const translateX = -progress * maxTranslate;
            gsap.set(stickyHeader, { x: translateX });

            cards.forEach((card, index) => {
                const delay = index * 0.1125;
                const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

                if (cardProgress > 0) {
                    const cardStartX = 25;
                    const cardEndX = -650;
                    const yPos = transform[index][0];
                    const rotations = transform[index][1];

                    const cardX = gsap.utils.interpolate(
                        cardStartX,
                        cardEndX,
                        cardProgress
                    );

                    const yProgress = cardProgress * 3;
                    const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
                    const yInterpolation = yProgress - yIndex;
                    const cardY = gsap.utils.interpolate(
                        yPos[yIndex],
                        yPos[yIndex + 1],
                        yInterpolation
                    );

                    const cardRotation = gsap.utils.interpolate(
                        rotations[yIndex],
                        rotations[yIndex + 1],
                        yInterpolation
                    );

                    gsap.set(card, {
                        xPercent: cardX,
                        yPercent: cardY,
                        rotation: cardRotation,
                        opacity: 1,
                    });
                } else {
                    gsap.set(card, { opacity: 0 });
                }
            });
        },
    });

    // Atualiza o ScrollTrigger após a inicialização do Lenis
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
    });
});

////////////////////////////////////////////////////////////////////////////// Scroll

// Função de contagem para o loader
function startLoader() {
    const counterElement = document.querySelector(".count p");
    let currentValue = 0;

    function updateCounter() {
        if (currentValue < 100) {
            const increment = Math.floor(Math.random() * 10) + 1;
            currentValue = Math.min(currentValue + increment, 100);
            counterElement.textContent = currentValue;

            const delay = Math.floor(Math.random() * 200) + 25;
            setTimeout(updateCounter, delay);
        }
    }

    updateCounter();
}

document.addEventListener("DOMContentLoaded", () => {
    startLoader();

    setTimeout(() => {
        const video = document.getElementById("background-video");
        video.style.display = "block";
    }, 0);
    
    setTimeout(() => {
        const preLoader = document.querySelector(".pre-loader");
        preLoader.style.display = "none"; // Oculta o loader
    }, 5000); // Ajuste o tempo conforme necessário

    // Animações GSAP
    gsap.to(".count", { opacity: 0, delay: 3.5, duration: 0.5 });

    gsap.to(".pre-loader", {
        scale: 0.5,
        ease: "power4.inOut",
        duration: 2,
        delay: 3,
    });

    gsap.to(".loader", {
        height: "0",
        ease: "power4.inOut",
        duration: 1.5,
        delay: 3.75,
    });

    gsap.to(".loader-bg", {
        height: "0",
        ease: "power4.inOut",
        duration: 1.5,
        delay: 4,
    });

    gsap.to(".loader-2", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut",
        duration: 1.5,
        delay: 3.5,
    });

    gsap.to(".header h1", {
        y: 50,
        ease: "power4.inOut",
        duration: 1.5,
        delay: 3.75,
        stagger: 0.05,
    });

    gsap.to(".img", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "power4.inOut",
        duration: 1.5,
        delay: 4.5,
        stagger: 0.25,
    });

    // Animação Anime.js
    const textWrapper = document.querySelector(".ml16");
    textWrapper.innerHTML = textWrapper.textContent.replace(
        /([^\s])/g,
        "<span class='letter'>$&</span>"
    );

    anime
        .timeline({ loop: false })
        .add({
            targets: ".ml16 .letter",
            translateY: [-100, 0],
            easing: "easeOutExpo",
            duration: 1500,
            delay: (el, i) => 30 * i,
        })
        .add({
            targets: ".ml16 .letter",
            translateY: [0, 100],
            easing: "easeOutExpo",
            duration: 3000,
            delay: (el, i) => 2000 + 30 * i,
        });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Section4
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop",
        "M0,0 C0.488,0.02 0.467,0.286 0.5, 0.5 0.532,0.712 0.58, 1 1, 1"
    );
    const slider = document.querySelector(".section4 .slider");
    const sliderTitle = document.querySelector(".section4 .slider-title");
    const sliderItems = document.querySelector(".section4 .slider-items");
    const sliderPreview = document.querySelector(".section4 .slider-preview");
    const sliderCounter = document.querySelector(".section4 .slider-counter p");
    const totalSlides = 7;
    let activeSlideIndex = 1;
    let isAnimating = false;

    const sliderContent = [
        { name: "Electric Cherry", img: "./Assets/img/img4.jpg" },
        { name: "Neroli Portofino", img: "./Assets/img/img2.jpg", },
        { name: "Jasmin Rouge", img: "./Assets/img/img3.jpg" },
        { name: "Vanille Fatale", img: "./Assets/img/img1.jpg" },
        { name: "Ébène Fumé", img: "./Assets/img/img5.jpg" },
        { name: "Bitter Peach", img: "./Assets/img/img6.jpg" },
        { name: "Vanilla Sex", img: "./Assets/img/img7.jpg" },
    ];

    const clipPath = {
       closed: "polygon(25% 30%, 75% 30%, 75% 70%, 25% 70%)",
       open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    };

    const slidePositions = {
        prev: { left: "15%", rotation: -90 },
        active: { left: "50%", rotation: 0 },
        next: { left: "85%", rotation: 90 },
    };

    function splitTextIntoSpans(element) {
        element.innerHTML = element.innerText
            .split("")
            .map((char) => `<span>${char === " " ? "  " : char}</span>`)
            .join("");
    }

    function createAndAnimateTitle(content, direction) {
        const newTitle = document.createElement("h1");
        newTitle.innerText = content.name;
        sliderTitle.appendChild(newTitle);
        splitTextIntoSpans(newTitle);

        const yOffset = direction === "next" ? 60 : -60;
        gsap.set(newTitle.querySelectorAll("span"), { y: yOffset });
        gsap.to(newTitle.querySelectorAll("span"), {
            y: 0,
            duration: 1.25,
            stagger: 0.02,
            ease: "hop",
            delay: 0.25,
        });

        const currentTitle = sliderTitle.querySelector("h1:not(:last-child)");
        if (currentTitle) {
            gsap.to(currentTitle.querySelectorAll("span"), {
                y: -yOffset,
                duration: 1.25,
                stagger: 0.02,
                ease: "hop",
                delay: 0.25,
                onComplete: () => currentTitle.remove(),
            });
        }
    }

    function createSlide(content, className) {
        const slide = document.createElement("div");
        slide.className = `slide-container ${className}`;
        slide.innerHTML = `<div class="slide-img"><img src="${content.img}" alt="${content.name}"></div>`;
        return slide;
    }

    function getSlideIndex(increment) {
        return ((activeSlideIndex + increment - 1 + totalSlides) % totalSlides) + 1;
    }

    function updateCounterAndHighlight(index) {
        sliderCounter.textContent = `${index}/${totalSlides}`;
        sliderItems
            .querySelectorAll("p")
            .forEach((item, i) =>
                item.classList.toggle("activeItem", i === index - 1)
            );
    }

    function updatePreviewImage(content) {
        const newImage = document.createElement("img");
        newImage.src = content.img;
        newImage.alt = content.img;
        sliderPreview.appendChild(newImage);

        gsap.fromTo(
            newImage,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 1,
                ease: "power2.inOut",
                delay: 0.5,
                onComplete: () =>
                    sliderPreview.querySelector("img:not(:last-child)")?.remove(),
            }
        );
    }

    function animateSlide(slide, props) {
        gsap.to(slide, { ...props, duration: 2, ease: "hop", borderRadius: "20px"});
        gsap.to(slide.querySelector(".slide-img"), {
            rotation: -props.rotation,
            duration: 2,
            ease: "hop",
        });
    }

    function transitionSlides(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const [outgoingPos, incomingPos] =
            direction === "next" ? ["prev", "next"] : ["next", "prev"];

        const outgoingSlide = slider.querySelector(`.${outgoingPos}`);
        const activeSlide = slider.querySelector(".active");
        const incomingSlide = slider.querySelector(`.${incomingPos}`);

        animateSlide(incomingSlide, {
            ...slidePositions.active,
            clipPath: clipPath.open,
        });
        animateSlide(activeSlide, {
            ...slidePositions[outgoingPos],
            clipPath: clipPath.closed,
        });
        gsap.to(outgoingSlide, { scale: 0, opacity: 0, duration: 2, ease: "hop" });

        const newSlideIndex = getSlideIndex(direction === "next" ? 2 : -2);
        const newSlide = createSlide(sliderContent[newSlideIndex - 1], incomingPos);
        slider.appendChild(newSlide);
        gsap.set(newSlide, {
            ...slidePositions[incomingPos],
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            opacity: 0,
            clipPath: clipPath.closed,
        });
        gsap.to(newSlide, { scale: 1, opacity: 1, duration: 2, ease: "hop" });

        const newActiveIndex = getSlideIndex(direction === "next" ? 1 : -1);
        createAndAnimateTitle(sliderContent[newActiveIndex - 1], direction);
        updatePreviewImage(sliderContent[newActiveIndex - 1]);

        setTimeout(() => updateCounterAndHighlight(newActiveIndex), 1000);

        setTimeout(() => {
            outgoingSlide.remove();
            activeSlide.className = `slide-container ${outgoingPos}`;
            incomingSlide.className = "slide-container active";
            newSlide.className = `slide-container ${incomingPos}`;
            activeSlideIndex = newActiveIndex;
            isAnimating = false;
        }, 2000);
    }

    slider.addEventListener("click", (e) => {
        const clickedSlide = e.target.closest(".slide-container");
        if (clickedSlide && !isAnimating) {
            transitionSlides(
                clickedSlide.classList.contains("next") ? "next" : "prev"
            );
        }
    });

    Object.entries(slidePositions).forEach(([key, value]) => {
        gsap.set(`.section4 .slide-container.${key}`, {
            ...value,
            xPercent: -50,
            yPercent: -50,
            clipPath: key === "active" ? clipPath.open : clipPath.closed,
        });
        if (key !== "active") {
            gsap.set(`.section4 .slide-container.${key} .slide-img`, {
                rotation: -value.rotation,
            });
        }
    });

    const initialTitle = sliderTitle.querySelector("h1");
    splitTextIntoSpans(initialTitle);
    gsap.fromTo(
        initialTitle.querySelectorAll("span"),
        {
            y: 60,
        },
        {
            y: 0,
            duration: 1,
            stagger: 0.02,
            ease: "hop",
        }
    );

    updateCounterAndHighlight(activeSlideIndex);

    sliderItems.querySelectorAll("p").forEach((item, index) => {
        item.addEventListener("click", () => {
            if (index + 1 !== activeSlideIndex && !isAnimating) {
                transitionSlides(index + 1 > activeSlideIndex ? "next" : "prev");
            }
        });
    });
});

///////////////////////////////////////////////////////////////////////////////////////
// Footer
ScrollTrigger.create({
    trigger: ".startfuck",
    start: "bottom+=1200",
    end: "+=1800",
    scrub: 0.8,
    onUpdate: (self) => {
        const galleryWrapper = document.querySelector(".ggallery-wrapper");
        const sideCols = document.querySelectorAll(".col:not(.main)");
        const mainImg = document.querySelector(".immg.main img");

        const scale = 1 + self.progress * 3; // Reduzido o scale
        const yTranslate = self.progress * 100;
        const mainImgScale = 1 + self.progress * 0.3; // Ajustei o valor do scale para não ampliar demais a imagem

        galleryWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

        sideCols.forEach((col) => {
            col.style.transform = `translateY(${yTranslate}px)`;
        });
    },
});

document.addEventListener("DOMContentLoaded", () => {

    const Footer = document.querySelector(".tf-footer");
    function Animation2() {
        gsap.fromTo(Footer, {
            y: "-80%",
            zIndex: '-1',
        }, {
            y: '0%',
            scrollTrigger: {
                trigger: ".section5",
                start: "bottom bottom",
                end: "bottom center",
                scrub: true,
            }
        })
    }
    Animation2();
});