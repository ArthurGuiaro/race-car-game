
let button = document.querySelector("#start-button")
let buttons = document.querySelectorAll(".color")
//30,390

let obstacles = []
let gasolines = []
let interval = null
let fuel = 9
let game = {
    widthCanvas: 500,
    heightCanvas: 700,
    Canvas: document.querySelector("#canvas"),
    body: document.querySelector("body"),
    frames: 0,
    score: 0,
    running: false,
    carImage: false,

    prepareCanvasArea(color) {
        console.log(color)
        if (color === "blue") car = new component(imgBlueCar, null, 210, 510, 79, 159)
        if (color === "green") car = new component(imgGreenCar, null, 210, 510, 79, 159)
        if (color === "purple") car = new component(imgPurpleCar, null, 210, 510, 79, 159)
        if (color === "red") car = new component(imgRedCar, null, 210, 510, 79, 159)
        if (color === "yellow") car = new component(imgYellowCar, null, 210, 510, 79, 159)

        document.querySelector("#white-square").style.zIndex = 10

        this.carImage = true
    },

    button() {
        if (this.carImage) this.startGame()
    },
    startGame() {
        document.querySelector("#white-square").style.zIndex = 10
        setTimeout(() => {
            interval = setInterval(() => {
                updateGameArea()
            }, 20);
            this.running = true

            button.innerHTML = "Pause"
        }, 5000)


        context = this.Canvas.getContext("2d")
        context.clearRect(0, 0, 500, 700)
        context.font = '100px serif'
        context.fillStyle = 'red'
        context.fillText(`1`, 125, 340)


        setTimeout(() => {
            context.clearRect(0, 0, 500, 700)
            context.fillText(`2`, 125, 340)
        }, 1000)

        setTimeout(() => {
            context.clearRect(0, 0, 500, 700)
            context.fillText(`3`, 125, 340)
        }, 2000)

        setTimeout(() => {
            context.clearRect(0, 0, 500, 700)
            context.fillText(`4`, 125, 340)
        }, 3000)

        setTimeout(() => {
            context.clearRect(0, 0, 500, 700)
            context.fillText(`5`, 125, 340)
        }, 4000)
    },
    stop(text) {
        clearInterval(interval)
        context = this.Canvas.getContext("2d")
        context.clearRect(0, 0, 500, 700)
        context.font = '30px serif'
        context.fillStyle = 'red'
        context.fillText(`GAME OVER`, 200, 340)
        context.font = '20px serif'
        context.fillStyle = 'black'
        if(text === "You ran out of gas") context.fillText(text, 217, 365)
        if(text === "You crashed the car") context.fillText(text, 213, 365)
        context.fillText(`Score: ${this.score}`, 250, 390)
        this.reset()
        console.log("acabou")
    },
    reset() {
        this.frames = 0
        this.score = 0
        fuel = 8
        this.running = false
        obstacles = []
        gasolines = []
        car.x = 210
        car.y = 510
        button.innerHTML = "RestartGame"
        document.querySelector("#white-square").style.zIndex = "-1"
    },
    pause() {
        context = this.Canvas.getContext("2d")
        button.innerHTML = "Continue"
        this.running = false
        clearInterval(interval)
        context.font = '100px serif'
        context.fillStyle = 'red'
        context.fillText(`Pause`, 125, 340)

    }

}

class component {
    constructor(image, color, x, y, width, height) {
        this.image = image
        this.color = color
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speedX = 0
        this.speedY = 0
    }

    top() {
        return this.y
    }

    bottom() {
        return this.y + this.height
    }

    left() {
        return this.x
    }

    right() {
        return this.x + this.width
    }



    newPos() {
        if (this.x + this.speedX > 394) {
            this.x = 394
        } if (this.x + this.speedX < 30) {
            this.x = 30
        } if (this.y + this.speedY > 541) {
            this.y = 541
        } if (this.y + this.speedY < 0) {
            this.y = 0
        }
        else {
            this.x += this.speedX
            this.y += this.speedY
        }
    }

    crash(obstacle) {
        return !(
            this.bottom() < obstacle.top() ||
            this.top() > obstacle.bottom() ||
            this.right() < obstacle.left() ||
            this.left() > obstacle.right()
        )
    }

    draw() {
        let context = game.Canvas.getContext("2d")
        if (this.image === "none") {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.width, this.height)
        } else {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }

}
let background = new component(imgRoad, null, 0, 0, game.widthCanvas, game.heightCanvas)
let car = null

let divisor = 60
let speed = 5

function calculateSpeedObstacles() {
    if (game.frames % 1000 === 0 && game.frames > 0) {
        console.log("speed up")
        if (divisor > 30) divisor -= 5
        speed += 1

    }
}

function updateScore() {
    game.score = Math.floor(game.frames / 5)
    let context = game.Canvas.getContext("2d")
    context.font = '18px serif'
    context.fillStyle = 'black'
    context.fillText(`Score: ${game.score}`, 20, 40)
}

function checkCrash() {
    let status = obstacles.some((obstacle) => {
        return car.crash(obstacle)
    })

    if (status) {
        game.stop("You crashed the car")
    }
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += speed// começa em 5
        obstacle.draw()
    })

    game.frames += 1

    if (game.frames % divisor === 0) {
        let y = 20
        let maxWidth = 341
        let minWidth = 40
        let width = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth)

        let minGap = 119
        let maxGap = 341
        let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap)

        obstacles.push(new component("none", "red", 0, y, width, 30))
        obstacles.push(new component("none", "red", width + gap, y, 700 - width - gap, 30))
    }

}

let firstCar
let secondCar
let thirdCar

function selectCars() {
    let cars = [imgGreenObstacle, imgLightYellowObstacle, imgPurpleObstacle, imgRedObstacle, imgYellowObstacle]


    for (let i = 2; i >= 0; i -= 1) {
        if (i === 2) {
            firstCar = cars[Math.floor(Math.random() * 5)]
            let index = cars.indexOf(firstCar)
            cars.splice(index, 1)
            // console.log(cars)
            // console.log(firstCar)
        }
        if (i === 1) {

            if (cars.indexOf(firstCar) === 0) {
                secondCarCar = cars[Math.floor((Math.random() * 4) + 1)]
            } else {
                secondCar = cars[Math.floor((Math.random() * 4))]
            }
            let index = cars.indexOf(secondCar)
            cars.splice(index, 1)
            // console.log(cars)
            // console.log(secondCar)

        }
        if (i === 0) {
            if (cars.indexOf(firstCar) === 0 || cars.indexOf(secondCar) === 0) {
                thirdCar = cars[Math.floor((Math.random() * 3) + 1)]
            } else {
                thirdCar = cars[Math.floor((Math.random() * 3))]
            }

            let index = cars.indexOf(thirdCar)
            cars.splice(index, 1)
            // console.log(cars)
            // console.log(thirdCar)
        }

    }
}


let firstX

let secondX

function updateCars() {

    // pista vai do 60 ao 365+159(524)
    obstacles.forEach(obstacle => {
        obstacle.y += 7// começa em 5
        obstacle.draw()
    })

    game.frames += 1

    if (game.frames % 65 === 0) {
        fuel -= 1
        let width = 365 // 375

        selectCars()

        let y = 0
        firstX = Math.floor((Math.random() * 232) + 64)//64
        oneX = firstX + 89
        let initalWidth = Math.floor(Math.random() * width)
        // console.log(firstX)
        // console.log(firstCar)
        obstacles.push(new component(firstCar, "none", firstX, y, 69, 129))

        if (365 - (firstX + 69) > 178) {
            // console.log("criei o 2")

            let blankSpace = 365 - firstX - 109 - 69 - 69
            secondX = Math.floor((Math.random() * blankSpace))
            twoX = firstX + 69 + 109 + secondX + 89
            // console.log(secondX)
            obstacles.push(new component(secondCar, "none", firstX + 69 + 109 + secondX, y, 69, 129))

        }


        // obstacles.push(new component(thirdCar,"none",x,y, 79, 159))


        // let minGap = 119
        // let maxGap = 341
        // let gap = Math.floor(Math.random()* (maxGap - minGap + 1) + minGap)

        // obstacles.push(new component("none", "red",width + gap, y, 700 - width-gap,30 ))
    }
}

let oneX
let twoX
function updateGasoline() {
    // pista vai do 60 ao 365+159(524)
    gasolines.forEach(gasoline => {
        gasoline.y += 7// começa em 5
        gasoline.draw()
    })
    let dice = [oneX, twoX]




    if (game.frames % 260 === 0) {
        console.log(dice)




        let x = dice[Math.floor(Math.random() * dice.length)]
        console.log(firstX + 89)
        console.log(secondX + 89)
        console.log(x)
        let y = 0


        gasolines.push(new component(imgGasoline, "none", x, y, 61, 92))


    }
}

function pickGasoline() {
    let status = gasolines.some((gasoline) => {
        return car.crash(gasoline)
    })



    if (status) {

        fuel = 9
        gasolines = []
    }
}

function checkFuel() {
    if (fuel === 0) game.stop("You ran out of gas")
}

function showFuel() {

    let context = game.Canvas.getContext("2d")
    context.fillStyle = "dark"
    context.fillRect(370, 10, 100, 30)
    context.fillStyle = "red"
    context.fillRect(375, 15, 10, 20)
    if (fuel === 1) {

    }
    if (fuel === 2) {

        context.fillStyle = "red"
        context.fillRect(375, 15, 20, 20)
    }
    if (fuel === 3) {

        context.fillStyle = "red"
        context.fillRect(375, 15, 30, 20)
    }
    if (fuel === 4) {

        context.fillStyle = "orange"
        context.fillRect(375, 15, 40, 20)
    }
    if (fuel === 5) {

        context.fillStyle = "yellow"
        context.fillRect(375, 15, 50, 20)
    }
    if (fuel === 6) {

        context.fillStyle = "yellow"
        context.fillRect(375, 15, 60, 20)
    }
    if (fuel === 7) {

        context.fillStyle = "green"
        context.fillRect(375, 15, 70, 20)
    }
    if (fuel === 8) {

        context.fillStyle = "green"
        context.fillRect(375, 15, 80, 20)
    }
    if (fuel === 9) {

        context.fillStyle = "green"
        context.fillRect(375, 15, 90, 20)
    }

}

let lineCounter = 0
let secondLineCounter = 0
let lineY = 0
lines = []

function drawLine() {
    // console.log(secondLineCounter)
    if (lineCounter === 0) {

        for (let i = 24; i >= 1; i -= 1) {

            lines.push(new component(imgRoadLine, null, 248, lineY, 4, 15))
            lineY += 30

        }

        lineCounter = 1
    }

    if (secondLineCounter === 6) {
        lines.pop()
        // console.log(lines)
        secondLineCounter = 0
    }

    if (secondLineCounter === 1) {
        lines.unshift(new component(imgRoadLine, null, 248, 0, 4, 15))
        // console.log(lines)
    }

    lines.forEach((line) => {
        line.draw()
        line.y += 5
    })
    secondLineCounter += 1
}

function updateGameArea() {
    background.draw()
    drawLine()

    car.newPos()
    car.draw()
    // calculateSpeedObstacles()
    // updateObstacles()
    updateCars()
    updateGasoline()
    showFuel()
    pickGasoline()
    checkFuel()
    updateScore()
    checkCrash()


}

window.onload = () => {

    let context = game.Canvas.getContext("2d")
    context.font = '30px serif'
    context.fillStyle = 'black'
    context.fillText(`Choose the car's color to start`, 125, 300)
}


buttons.forEach(() => {
    if (game.carColor === null) game.ch
})

button.addEventListener("click", () => {
    if (!game.running) game.button()
    else game.pause()
}
)
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            car.speedY = -10
            break
        case 'ArrowDown':
            car.speedY = 10
            break
        case 'ArrowLeft': // left arrow
            car.speedX = -10
            break
        case 'ArrowRight': // right arrow
            car.speedX = 10
            break
        case 'Control': // control
            if (!game.running) game.startGame()
            else game.pause()
            break
    }
})
document.addEventListener('keyup', (e) => {
    car.speedX = 0
    car.speedY = 0
})

let colorButtons = document.querySelectorAll(".color")

colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        game.prepareCanvasArea(button.id)
        document.querySelector("#white-square").style.zIndex = 10
    })
})



