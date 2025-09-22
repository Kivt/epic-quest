import type { Scene } from "../../types/story";

const scene: Scene = {
    id: "cafe",
    label: "Добра відьма",
    slides: [
        {
            id: 'c1',
            initial: {
                inherit: true,
                background: "cafe",
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
                    { type: "setBackground", id: "cafe", blur: 3 },
                    {
                        type: "say",
                        text: "Ось і добралися. Ми з тобою мододці!",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Правда я з Марʼянею не знайомий, і взагалі нікого не знаю хто б її бачив хоч раз",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "turn" },
                    {
                        type: "say",
                        text: "Поки ми думаємо що нам робити далі, давай зайдем всередино і зʼїмо щось смачненьке",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Додаткові сили нам знадобляться для того щоб перемогти злу чаклунку",
                    },
                ],
                [
                    { type: "setBackground", id: "cafe_inside", blur: 0 },
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "say",
                        text: "Замов щось смачненьке і перекуси (завдання)",
                    },
                ],
                [
                    { type: "setBackground", id: "cafe_inside", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        text: "Ням ням ням )",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "І ось як ви доїли лунає голос в ваших головах...",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "Ви мене шукали ?",
                    },
                ],
                [
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "surprised",
                    }
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "turn" },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "idk" },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Хто це сказав ? Де ти є ?",
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
                        text: "Я знаю з якою метою ви сюди прийшли...",
                    },
                ],
                [
                    { type: "hideCharacter", id: "carrot" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "whisper",
                    },
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Ну тепер зрозуміло чому 'Морквʼяна' )",
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
                        text: "Ви хочете подолати злу відьму яка живе неподалік, і я вам допоможу",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Ви спитаєте чому я вам допомагаю ?",
                    },
                ],
                [
                    { type: "hideCharacter", id: "carrot" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Ні, не спитаємо",
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
                        text: "Ну ок, тоді просто слухайте що потрібно робити",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Зла відьма просто так не віддасть вам квітку, що дає їй сили",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Але якщо сказати правильне заклинання, то відьма буде вимушена вам віддати квітку",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Заклинання таке:",
                    },
                ],
                [
                    { type: "hideCharacter", id: "carrot" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "cast",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Авада кедавра КУРВА !!!???",
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
                        text: "Ні, але якщо моє не спрацює то можете спробувати )",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Вам потрібно буде підійти в Гарденію, знайти відьму (дівчина в фартуху) і сказати заклинання",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "І це не може зробити будь-хто, а це має бути саме закохана квіточка у якої є коханий Віталік",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "А це саме ти",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'carrot',
                        text: "Тому зараз вам потрібно дійти до Гарденії, і я вам надішлю заклинання психо-повідомленням",
                    },
                ],
                [
                    { type: "hideCharacter", id: "carrot" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Прекрасно, погнали",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    { type: "setBackground", id: "gardenia", blur: 0 },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Дійти до гарденії (завдання)",
                    },
                ],
            ],
            next: { scene: "gardenia", slide: "g1" },
        }
    ]
};

export default scene;