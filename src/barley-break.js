'use strict'

class Point {
  constructor(number, DOMpointer) {
    this.number = number
    this.DOMpointer = DOMpointer
  }

  getNumber() {
    return this.number
  }

  setNumber(num) {
    this.DOMpointer.innerText = num
    this.number = num
  }

  fadeOut() {
    this.DOMpointer.classList.remove(this.DOMpointer.classList[1])
    this.DOMpointer.classList.add('point--empty')
  }

  fadeIn(color) {
    this.DOMpointer.classList.remove('point--empty')
    this.DOMpointer.classList.add(color)
  }
}

export class Field {
  constructor($container) {
    this.$container = $container
    this.createGame()
  }

  pointStyles = [
    'brown',
    'light-brown',
    'light-green',
    'light-blue',
    'orange',
    'violet',
    'dark-khaki',
    'aquamarine',
    'darkpink',
    'deeppink',
    'lemon',
    'darkslateblue',
    'salad',
    'orangered',
    'springgreen',
  ]

  points = {
    emptyPoint: 15,
  }

  createGame() {
    this.$container.insertAdjacentHTML('beforeend', '<div class="field"></div>')
    this.$container.insertAdjacentHTML('beforeend', '<div class="info">Playing...</div>')
    this.$field = this.$container.querySelector('.field')
    this.$info = this.$container.querySelector('.info')

    let rndPoints = this.getRandomizedPoints().values()

    for (let i = 0; i < 15; i++) {
      const pointNum = rndPoints.next().value
      this.$field.insertAdjacentHTML('beforeend', `<div class="field-point">${pointNum}</div>`)
      this.points[`point${i}`] = new Point(pointNum, null)
    }

    this.$field.insertAdjacentHTML('beforeend', `<div class="field-point point--empty"></div>`)
    this.points[`point${15}`] = new Point(0, null)

    this.initField()
  }

  initField() {
    const pointsList = this.$field.querySelectorAll('.field-point')

    pointsList.forEach((elem, index) => {
      this.points[`point${index}`].DOMpointer = elem

      if (index < 15) {
        this.points[`point${index}`].DOMpointer.classList.add(
          this.pointStyles[this.points[`point${index}`].number - 1]
        )
      }

      this.points[`point${index}`].DOMpointer.addEventListener('click', (ev) => {
        if (
          this.points.emptyPoint == index + 1 ||
          this.points.emptyPoint == index - 1 ||
          this.points.emptyPoint == index + 4 ||
          this.points.emptyPoint == index - 4
        ) {
          this.points[`point${this.points.emptyPoint}`].setNumber(
            this.points[`point${index}`].number
          )
          const color = this.points[`point${index}`].DOMpointer.classList[1]

          this.points[`point${index}`].fadeOut()
          this.points[`point${this.points.emptyPoint}`].fadeIn(color)
          this.points.emptyPoint = index
          this.points[`point${index}`].number = 0

          if (this.checkForWin()) {
            this.winGame()
          }
        }
      })
    })
  }

  getRandomizedPoints() {
    const pointNumbers = new Set()
    while (pointNumbers.size < 15) {
      pointNumbers.add(Math.round(Math.random() * 14) + 1)
    }
    return pointNumbers
  }

  checkForWin() {
    for (let i = 0; i < 15; i++) {
      if (!(this.points[`point${i}`].number == i + 1)) {
        return false
      }
    }
    return true
  }

  winGame() {
    this.$info.style.background = '#33ff33'
    this.$info.innerText = 'You win!'
    this.$info.addEventListener('click', this.restartGame.bind(this))
  }

  restartGame() {
    if (this.checkForWin()) {
      this.$info.style.background = '#ffee008c'
      this.$info.innerText = 'Playing...'

      let rndPoints = this.getRandomizedPoints().values()

      for (let i = 0; i < 16; i++) {
        const pointNum = rndPoints.next().value
        this.points[`point${i}`].DOMpointer.classList.remove(
          this.points[`point${i}`].DOMpointer.classList[1]
        )
        if (i < 15) {
          this.points[`point${i}`].DOMpointer.classList.add(this.pointStyles[pointNum - 1])
          this.points[`point${i}`].DOMpointer.innerText = pointNum
          this.points[`point${i}`].number = pointNum
        } else {
          this.points[`point${i}`].DOMpointer.classList.add('point--empty')
          this.points[`point${i}`].DOMpointer.innerText = ''
        }
      }

      this.points.emptyPoint = 15
    }
  }
}
