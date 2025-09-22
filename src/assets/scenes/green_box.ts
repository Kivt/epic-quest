import type { Scene } from "../../types/story";

const scene: Scene = {
    id: "green_box",
    label: "Миші і зелений ящик",
    slides: [
        {
            id: 'b1',
            initial: {
                inherit: true,
                background: "nature",
                textbox: {
                    speaker: 'vitalik'
                }
            },
            steps: [
                [
                    { type: "setBackground", id: "green_box", blur: 8 },
                    {
                        type: "say",
                        text: "Згадую щось таке...",
                    },
                ],
                [
                    { type: "setBackground", id: "green_box", blur: 3 },
                    {
                        type: "say",
                        text: "І це досить поруч...",
                    },
                ],
                [
                    { type: "setBackground", id: "green_box", blur: 0 },
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "say",
                        text: "Згадав, кохана ти знаєш де це ? (якщо ні спитай підказку в Віталіка)",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Супер, отже потрібно дійти до цього місця. По машинам! (завдання)",
                    },
                ],
                [
                    { type: "setBackground", id: "green_box", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        text: "Ось і добралися, тепер потрібно якось звʼязатися з мишами, давай відкриємо ящик і запитаємо в них (завдання)",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "idk" },
                    {
                        type: "say",
                        text: "Що ? Закрито ? Приклєєли довбойоби !",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "think" },
                    {
                        type: "say",
                        text: "А знаєш що ?",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "default" },
                    {
                        type: "say",
                        text: "Я тебе люблю ❤️",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "А ще хочу сказати що ми будемо нагалоджувати телепатичний звʼязок з мишами!",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Візьми віталіка за руку і відчуй як магія протікає крізь тебе (завдання)",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "cast" },
                    {
                        type: "say",
                        text: "Ого! Відчуваю звʼязок!",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "default" },
                    {
                        type: "say",
                        text: "А нє стоп, це в животі булькає",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "cast" },
                    {
                        type: "say",
                        text: "Пробуємо знову!",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Альо Альо, прийом прийом, хто є на цій частоті ?",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "Хто це ? Звідки в вас цей номер ? Мені кредітів не треба",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Ми свої, від Рижика. Хочемо подолати злу відьму, ти знаєш як де її можна знайти?",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "mouse",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "О, тоді я вам точно допоможу! Мене звати Мишоль, я тут все чую, і про відьму теж чула",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "Зараз згадаю як називається це місце де вона знаходиться...",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "Здається якось так - 'Гандонія'",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "А ні, не так. Правильно - 'Гарденія'",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "Але вам її так просто не здолати. Щоб її здолати потрібно знати спеціальне закляття",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "А я, нажаль, його не знаю",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "Але чула хто знає!",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'mouse',
                        text: "Вам допоможе добра відьма яку звати 'Марʼяна', знайдіть її і вона вам допоможе.",
                    },
                ],
                [
                    { type: "hideCharacter", id: "mouse" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "О, дякуємо! Тепер ми ще на крок ближчі до подолання злої відьми.",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Кохана, я знаю де ця добра відьма, вона тут одна така.",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Та і думаю ти теж вже знаєш куди нам потрібно",
                    },
                ],
                [
                    { type: "setBackground", id: "cafe", blur: 0 },
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "say",
                        text: "Отже, йдемо до Марʼяни (завдання)",
                    },
                ],
            ],
            next: { slide: "с1" },
        }
    ]
};

export default scene;