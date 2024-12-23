export const js_animations = (nameAnim: string) => {

    if (nameAnim === 'animHeaderDivRandom') {

        const divBoxElement = (document.getElementsByClassName('header-title-anchor-div')[0] as HTMLDivElement);

        divBoxElement.animate([
            {transform: 'rotate(-10deg) scale(.7)', offset: 0},
            {transform: 'rotate(-10deg) scale(1)', offset: 0.5},
            {transform: 'rotate(-10deg) scale(.7)', offset: 1}
        ], {
            duration: 150,
            iterations: 1
        });
    }
};