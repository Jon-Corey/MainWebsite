const rootNode = document.querySelector('.embla')
const viewportNode = rootNode.querySelector('.embla__viewport')

const prevButtonNode = rootNode.querySelector('.embla__prev')
const nextButtonNode = rootNode.querySelector('.embla__next')

const options = { loop: true }
const embla = EmblaCarousel(viewportNode, options)

prevButtonNode.addEventListener('click', embla.scrollPrev, false)
nextButtonNode.addEventListener('click', embla.scrollNext, false)
