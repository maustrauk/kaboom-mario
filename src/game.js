kaboom({
    global: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
    canvas: document.getElementById("game"),
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const ENEMY_SPEED = 30;
const BIG_JUMP_FORCE = JUMP_FORCE * 1.5;
const BIG_MOVE_SPEED = MOVE_SPEED * 1.5;
const FALL_DEATH = 400;

let CURRENT_JUMP_FORCE = JUMP_FORCE;
let CURRENT_MOVE_SPEED = MOVE_SPEED;
let isJumping = true;


scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const maps = [
        [
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '     *   =%=%=                        ',
            '                                      ',
            '                            -+        ',
            '                    ^   ^   ()        ',
            '==============================   =====',
              ],
        [
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£                                       £',
            '£        @_@@@@              x x        £',
            '£                          x x x        £',
            '£                        x x x x  x   -+£',
            '£               z   z  x x x x x  x   ()£',
            '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
              ]
    ];        

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '^': [sprite('evil-shroom'), solid(), 'dangerous', body()],
        '#': [sprite('mushroom'), solid(), 'mushroom', body()],
        '!': [sprite('blue-block'), solid(), scale(0.5)],
        '£': [sprite('blue-brick'), solid(), scale(0.5)],
        'z': [sprite('blue-evil-shroom'), solid(), scale(0.5), 'dangerous'],
        '@': [sprite('blue-surprise'), solid(), scale(0.5), 'coin-surprise'],
        '_': [sprite('blue-surprise'), solid(), scale(0.5), 'mushroom-surprise'],
        'x': [sprite('blue-steel'), solid(), scale(0.5)],
    };


    const gameLevel = addLevel(maps[level], levelCfg);

    const scoreLable = add([
        text(score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
        }
    ]);

    add([text('level ' + parseInt(level + 1) ), pos(40, 6)])

    function big() {
        let timer =0;
        let isBig = true;

        return {
            update() {
                if (isBig) {
                    CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
                    CURRENT_MOVE_SPEED = BIG_MOVE_SPEED;
                    timer -= dt();
                    if (timer <= 0) {
                        this.smallify();
                    }
                }
            },
            isBig() {
                return isBig;
            },
            smallify() {
                CURRENT_JUMP_FORCE = JUMP_FORCE;
                CURRENT_MOVE_SPEED = MOVE_SPEED;
                this.scale = vec2(1);
                timer = 0;
                isBig = false;
            },
            biggify(time) {
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
                CURRENT_MOVE_SPEED = BIG_MOVE_SPEED;
                this.scale = vec2(2);
                timer = time;
                isBig = true;
            },
        }
    }

    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot')
    ]);

    action('mushroom', (m) => {
        m.move(60,0);
    });

    action('dangerous', (d) => {
        d.move(-ENEMY_SPEED, 0);
    })

    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn('}', obj.gridPos.sub(0,0));
        }

        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn('}', obj.gridPos.sub(0,0));
        }
    });

    player.collides('mushroom', (m) => {
        destroy(m);
        player.biggify(6);
    });

    player.collides('coin', (c) => {
        destroy(c);
        scoreLable.value++;
        scoreLable.text = scoreLable.value;
    });

    player.collides('dangerous', (d) => {
        if (isJumping) {
            destroy(d);
        } else {
            go('lose', { score: scoreLable.value});
        }
    });

    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLable.value
            });
        });
    })

    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLable.value});
        }
    })

    player.action(() => {
        if (player.grounded()) {
            isJumping = false;
        }
    })

    keyDown('left', () => {
        player.move(-CURRENT_MOVE_SPEED, 0);
    });

    keyDown('right', () => {
        player.move(CURRENT_MOVE_SPEED, 0);
    })

    keyPress('space', () => {
        if(player.grounded()) {
            isJumping = true;
            player.jump(CURRENT_JUMP_FORCE);
        }
    });
});

scene('lose', ({score}) => {
    add([text(score, 32), origin('center'), pos(width() / 2, height() / 2)])
});

start("game", { level: 0, score: 0});