class Game {
    constructor(type) {
        this.type = type
        this.airplane = document.createElement('img')
        this.box = document.getElementsByClassName('bg')[0]
        this.blood = 100
        this.enemies = []
        this.zds = []
        this.init()
    }
    init() {
        this.airplane.src = './imgs/airplane.png'
        this.airplane.style.left = '275px'
        this.airplane.classList = [...this.airplane.classList, 'myair']
        // this.airplane.style.left = `${Math.random() * 450 + 50}px`
        // this.airplane.style.top = '0px'
        this.box.appendChild(this.airplane)
        this.attack()
        setInterval(() => {
            this.createEnemy()
        }, 2000) //敌机生成速度
        this.moveEnemy()
    }
    is_overlap = function(node1,node2) { 
        var rect1 = node1.getBoundingClientRect(); 
        var rect2 = node2.getBoundingClientRect(); 
        var overlap = !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom); 
        return overlap; 
    }
    createEnemy() {
        let enemy = document.createElement('img')
        enemy.src = './imgs/enemy.png'
        enemy.style.position = 'absolute'
        enemy.style.left = `${Math.random() * 450 + 60}px`
        enemy.style.top = '0px'
        this.enemies.push(enemy)
        this.box.appendChild(enemy)
    }
    moveEnemy() {
        setInterval(() => {
            for (let i=0; i<this.enemies.length; i++) {
                let enemy = this.enemies[i]
                let top = +enemy.style.top.replace('px', '')
                let left = +enemy.style.left.replace('px', '')
                if (top + 10 >= 900) {
                    this.dead()
                    this.box.removeChild(enemy)
                    this.enemies.splice(i ,1)
                } else {
                    enemy.style.top = `${top + 10}px`
                    enemy.style.left = `${left - ((Math.random()-0.5) * 20)}px`
                }
            }
        }, 500)

    }
    dead() {
        this.box.removeChild(this.airplane)
        this.airplane = null
        alert('Game over')
    }
    control(direction) {
        let left = +this.airplane.style.left.replace('px', '')
        if (direction === 'left' && left - 20 >= 50) {
            left -= 20
        } else if (direction === 'right' && left + 20 <= 500) {
            left += 20
        }
        this.airplane.style.left = `${left}px`
    }
    attack() {
        let timer = setInterval(() => {
            if(this.airplane) {
                let my_position = this.airplane.offsetLeft
                let zd = document.createElement('div')
                zd.style.position = 'absolute'
                zd.style.bottom = '130px'
                zd.style.left = my_position + 'px'
                zd.classList = [...zd.classList, 'zd']
                zd.style.transition = 'all .1s linear'
                this.zds.push(zd)
                let timer2 = setInterval(() => {
                    let bottom = +zd.style.bottom.replace('px', '')
                    if (bottom >= 930) {
                        clearInterval(timer2)
                        try {
                            this.box.removeChild(zd)
                            let idx = this.zds.indexOf(zd)
                            this.zds.splice(idx, 1)
                        } catch (err) {
                            throw '击落敌机'
                        }
                    }
                    for (let i=0; i<this.enemies.length;i++) {
                        if (this.is_overlap(this.enemies[i], zd)) {
                            let idx = this.zds.indexOf(zd)
                            this.box.removeChild(zd)
                            this.box.removeChild(this.enemies[i])
                            this.zds.splice(idx, 1)
                            this.enemies.splice(i, 1)
                        }
                    }
                    zd.style.bottom = `${bottom + 10}px`
                }, 50) // 子弹移速
                this.box.appendChild(zd)

            } else {
                clearInterval(timer)
            }
        }, 100) // 射速
    }
}
