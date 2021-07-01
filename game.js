kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

loadRoot('/assets/')
loadSprite('coin', 'coin.png')
loadSprite('evil-shroom', 'evil-shroom.png')
loadSprite('brick', 'brick.png')
loadSprite('block', 'block.png')
loadSprite('mario', 'mario.png')
loadSprite('mushroom', 'mushroom.png')
loadSprite('surprise', 'surprise.png')
loadSprite('unboxed', 'unboxed.png')
loadSprite('pipe-top-left', 'pipe-top-left.png')
loadSprite('pipe-top-right', 'pipe-top-right.png')
loadSprite('pipe-bottom-left', 'pipe-bottom-left.png')
loadSprite('pipe-bottom-right', 'pipe-bottom-right.png')

scene("game", () => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const map = [
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '==============================   =====',
          ]        

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
    }

    const gameLevel = addLevel(map, levelCfg)
})

start("game")