import type { Scene } from "../../types/story";

const scene: Scene = {
    id: 'kittens',
    label: 'Знайти котиків',
    slides: [
        {
            id: 'k1',
            initial: {
                inherit: false,
                background: "yard",
                backgroundBlur: 0,
                textbox: {
                    speaker: 'vitalik',
                }
            },
            steps: [
                [
                    {
                        type: "say",
                        text: "Одягайся і знайди це місце біля будинку поруч (завдання)",
                    },
                ],
                [
                    { type: "setBackground", id: "yard", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        text: "Знаю тут одного кота, звати Рижик, хоча окрас в нього чорно-білий.",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "whisper" },
                    {
                        type: "say",
                        text: "Він якось упав з вікна бабулі на голову, в якої було риже волосся",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Він як втікав то те волосся застряло в його шерсті от і прозвали Рижиком",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "default" },
                    {
                        type: "say",
                        text: "В нього повинна бути якась інформація про чарівницю",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "turn" },
                    {
                        type: "say",
                        text: "Я зайду в гості і розпитаю, а ти послідкуй щоб нам ніхто не заважав",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                ],
                [
                    {
                        type: "say",
                        text: "Здоров Рижик, шо ти, як ти ? Як життя ?  як котенята ?",
                    },
                ],
                [
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "red",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'red',
                        text: "Мяу мяу, мяу мяу мяяяяу",
                    },
                ],
                [
                    { type: "hideCharacter", id: "red" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Да ти шо! І що було далі ?",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "red",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'red',
                        text: "Повний мяу мяу мяу",
                    },
                ],
                [
                    { type: "hideCharacter", id: "red" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Ого, нам потрібна допомога, щоб подолати злу чарівницю. Що ти знаєш про неї ?",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "red",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'red',
                        text: "Все що я знаю це що в неї є чарівна квітка, яка дарує їх сили, якщо її забрати то чарівниці буде мяу мяу",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'red',
                        text: "Це все що я знаю, більше можете дізнатися в мишей які живуть в зеленому ящику",
                    },
                ],
                [
                    { type: "hideCharacter", id: "red" },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "О, дяка за інформацію, підемо шукати тоді мишей. Пожав лапу, погладив за вухом",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                ],
                [
                    { type: "setBackground", id: "yard", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "А ось і я. Ти чула нашу розмову?",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Що питаєш? Чому Рижик то мʼявкає то розмовляє Українською ?",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "whisper" },
                    {
                        type: "say",
                        text: "Насправді він розмовляє тільки Українською, а на 'мяу' він заміняє матюки )",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "think" },
                    {
                        type: "say",
                        text: "Отже нам потрібно знайти мишей в зеленому ящику, ти знаєш де це може бути ?",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "В мене є одна здогадка де це може бути, дай но я згадаю...",
                    },
                ],
            ],
            next: { scene: "green_box", slide: "b1" },
        }
    ]
}

export default scene;