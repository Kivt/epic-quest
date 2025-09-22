import type { Scene } from "../../types/story";

const scene: Scene = {
    id: "gardenia",
    label: "Зла відьма",
    slides: [
        {
            id: 'g1',
            initial: {
                inherit: true,
                background: "gardenia",
                backgroundBlur: 3,
                textbox: {
                    speaker: 'vitalik'
                }
            },  
            steps: [
                [
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        text: "Ось ми і тут",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "Вуууп вууууп дінь дінь",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "О! прийшло психо-повідомлення",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "carrot",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Заклинання звучить наступним чином, запамʼятай його добре!",
                    }
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Доброго дня, робили замовлення на букет з еустомою посередині. Дякую.",
                    }
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "І це все, вона тобі віддасть чарівну квітку",
                    }
                ],
                [
                    { type: "hideCharacter", id: "carrot" },
                    { type: "setBackground", id: "gardenia", blur: 0 },
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Зайди всередину і скажи заклинання (завдання). 'Доброго дня, робили замовлення на букет з еустомою посередині. Дякую.'",
                    }
                ],
                [
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    { type: "setBackground", id: "gardenia", blur: 3 },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Вітаю з Днем народження, моя кохана квіточко. Дуже тебе люблю і цілую і обнімаю і взагалі 😘",
                    }
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Чарівна історія завершується...",
                    }
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Але не ця )",
                    }
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Як в будь якому епічному квесті після перемоги над головним боссом чекає цінний приз",
                    }
                ],
                [
                    { type: "setBackground", id: "home_prize", blur: 0 },
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Отже, наступне завдання це знайти це міце і забрати приз (завдання)",
                    },
                ],
                [
                    { type: "setBackground", id: "home_prize", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Нехай цей подарунок завжди нагадує тобі, що ти моя кохана квіточка 🌸",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Кохаю тебе, і на цьому ця історія завершується",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Кінець",
                    },
                ]
            ]
        },
    ]
};

export default scene;