import type { Scene } from "../../types/story";

const scene: Scene = {
    id: "intro",
    label: "Вступ",
    slides: [
        {   
            id: "m1",
            initial: {
                inherit: false,
                background: "nature",
                backgroundBlur: 0,
                textbox: {
                    speaker: null,
                    text: "",
                },
            },
            steps: [
                [
                    {
                        type: "say",
                        text: "Едем. Вічний сад. Тут завжди панував спокій. Кожен день був схожий на попередній.",
                    },
                ],
                [
                    { type: "setBackground", id: "nature", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "angel",
                        pose: "neutral",
                    },
                    {
                        type: "say",
                        speaker: "angel",
                        text: "Я Рафаель — один із хранителів цього місця.",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Моє завдання — оберігати гармонію. Я виконував його тисячі років, але сьогодні щось змінилося.",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Повітря стало іншим, у досконалій тиші пролунав новий звук і я відчув те, чого не повинен був...",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "Пролунав незнайомий ангелу голос:",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "АЛЬО! Ти хто ? Як ти взагалі сюди залетів ???",
                    },
                ],
                [
                    {
                        type: "showCharacter",
                        slot: "right",
                        id: "vitalik",
                        pose: "shadow",
                    },
                    {
                        type: "say",
                        speaker: 'unknown',
                        text: "А ну брись звідси, голуб!",
                    },
                ],

                [
                    { type: "hideCharacter", id: "angel" },
                    { type: "updateCharacter", id: "vitalik", pose: "surprised" },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Куди мене занесло ? Як я тут опинився ?",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "idk" },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Якісь дивні дива",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "default" },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Ще й інтернет не працює. Проте який краєвид...",
                    },
                ],
                [
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "Тут канєншо гарно, але потрібно повертатися додому",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "cast" },
                    {
                        type: "say",
                        speaker: 'vitalik',
                        text: "*Максимально напрягся що аж ліс гуде*",
                    },
                ],
                [
                    { type: "hideCharacter", id: "vitalik" },
                    { type: "setBackground", id: "room", blur: 0 },
                    {
                        type: "say",
                        speaker: "vitalik",
                        text: "О! Дім милий дім )",
                    },
                ],
            ],
            next: { slide: "m2" },
        },
        {
            id: "m2",
            initial: {
                inherit: true,
                textbox: {
                    speaker: "vitalik",
                    text: "",
                },
            },
            steps: [
                [
                    {
                        type: "say",
                        text: "Але сьогодні історія не про мене, а про мою кохану квіточку 🌸 у якої день народження",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Тому на тебе чекає справжня пригода, з квестами, злими чаклунами і котиками )",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Отже, правила наступні, я тобі буду говорити і показувати завдання, а ти будеш їх виконувати",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Класно я придумав, правда ?)",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Є одна умова, переходити далі (натискати на ▶) потрібно тільки після того як ти виконала завдання",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Інакше можеш сама собі зіпсувати сюрпризи і веселощі, а вони точно будуть",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Я буду давати тобі підказки, буде написано (завдання) коли треба щось виконати.",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Отже, давай перевіримо чи все зрозуміло...",
                    },
                ],
                [
                    { type: "setBackground", id: "bathroom", blur: 0 },
                    {
                        type: "hideCharacter",
                        id: "vitalik"
                    },
                    {
                        type: "say",
                        text: "Спочатку підійди сюди (завдання)",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "А тепер поцілуй Віталіка)",
                    },
                ],
                [
                    { type: "setBackground", id: "bathroom", blur: 3 },
                    {
                        type: "showCharacter",
                        slot: "center",
                        id: "vitalik",
                        pose: "default",
                    },
                    {
                        type: "say",
                        text: "Молодець, тепер коли ти знаєш як все працює я тобі щось розкажу...",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "whisper" },
                    {
                        type: "say",
                        text: "В нашому місті сталася біда, зла чарівниця робить погані речі з кошенятами...",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "А саме - вона підкрадається до кошенят коли ті сплять і ...",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "шепче на вуха всякі матюки і що їх ніхто не любить. Від цього в кошенят депресія",
                    },
                ],
                [
                    { type: "updateCharacter", id: "vitalik", pose: "default" },
                    {
                        type: "say",
                        text: "І сьогодні саме ти врятуєш кошенят від депресії!",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "Отже, насамперед нам потрібно дізнатися як здолати чарівницю",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "В мене поруч є знайомі котики, треба в них розпитати як ти можеш це зробити",
                    },
                ],
                [
                    {
                        type: "say",
                        text: "А я тобі допоможу 😘",
                    },
                ],
            ],
            next: { scene: "kittens", slide: "k1" },
        },
    ],
}

export default scene