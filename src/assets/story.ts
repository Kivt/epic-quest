import type { Story } from "../types/story";

export const sampleStory: Story = {
    version: "1.0",
    meta: {
        id: "demo-story",
        title: "A Day at School",
    },
    assets: {
        backgrounds: {
            classroom_day: "/bg/classroom_day.svg",
            classroom_evening: "/bg/classroom_evening.svg",
            hallway: "/bg/hallway.svg",
            library: "/bg/library.svg",
            room: '/bg/room.avif'
        },
        characters: {
            yuki: {
                name: "Yuki",
                speaker_color: "#ADD8E6",
                poses: {
                    neutral: "/ch/yuki_neutral.svg",
                    smile: "/ch/yuki_smile.svg",
                    surprised: "/ch/yuki_surprised.svg",
                    sad: "/ch/yuki_sad.svg",
                },
            },
            teacher: {
                name: "Ms. Johnson",
                speaker_color: "#FFB6C1",
                poses: {
                    neutral: "/ch/teacher_neutral.svg",
                    stern: "/ch/teacher_stern.svg",
                    smile: "/ch/teacher_smile.svg",
                },
            },
            friend: {
                name: "Alex",
                speaker_color: "#98FB98",
                poses: {
                    neutral: "/ch/friend_neutral.svg",
                    excited: "/ch/friend_excited.svg",
                    worried: "/ch/friend_worried.svg",
                },
            },
        },
    },
    scenes: [
        {
            id: "morning",
            label: "Morning Class",
            slides: [
                {
                    id: "m1",
                    initial: {
                        inherit: false,
                        background: "room",
                        backgroundBlur: 3,
                        textbox: {
                            speaker: "yuki",
                            text: "Another day at school...",
                        },
                    },
                    steps: [
                        [
                            {
                                type: "showCharacter",
                                slot: "left",
                                id: "yuki",
                                pose: "neutral",
                            },
                            { type: "say", text: "I wonder what we'll learn today." },
                        ],
                        [
                            {
                                type: "showCharacter",
                                slot: "right",
                                id: "teacher",
                                pose: "neutral",
                            },
                            {
                                type: "say",
                                speaker: "teacher",
                                text: "Good morning, class! Today we have a special lesson.",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "surprised" },
                            {
                                type: "say",
                                speaker: "yuki",
                                text: "A special lesson? I wonder what it could be!",
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
                            speaker: "teacher",
                            text: "We'll be studying the history of our town.",
                        },
                    },
                    steps: [
                        [
                            { type: "updateCharacter", id: "teacher", pose: "smile" },
                            {
                                type: "say",
                                text: "I think you'll find it quite fascinating.",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "smile" },
                            {
                                type: "say",
                                speaker: "yuki",
                                text: "That does sound interesting!",
                            },
                        ],
                        [
                            { type: "transition", name: "fade", ms: 500 },
                            { type: "setBackground", id: "classroom_evening" },
                            {
                                type: "say",
                                speaker: "teacher",
                                text: "And that concludes today's lesson.",
                            },
                        ],
                    ],
                    next: { scene: "afternoon", slide: "a1" },
                },
            ],
        },
        {
            id: "afternoon",
            label: "After School",
            slides: [
                {
                    id: "a1",
                    initial: {
                        inherit: false,
                        background: "hallway",
                        textbox: {
                            speaker: "yuki",
                            text: "Class is finally over. What should I do now?",
                        },
                    },
                    steps: [
                        [
                            {
                                type: "showCharacter",
                                slot: "center",
                                id: "yuki",
                                pose: "neutral",
                            },
                            {
                                type: "showCharacter",
                                slot: "right",
                                id: "friend",
                                pose: "excited",
                            },
                            { type: "say", speaker: "friend", text: "Yuki! There you are!" },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "surprised" },
                            {
                                type: "say",
                                speaker: "yuki",
                                text: "Oh, Alex! You startled me.",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "smile" },
                            { type: "say", text: "What's got you so excited?" },
                        ],
                    ],
                    next: { slide: "a2" },
                },
                {
                    id: "a2",
                    initial: {
                        inherit: true,
                        textbox: {
                            speaker: "friend",
                            text: "I found something amazing in the library!",
                        },
                    },
                    steps: [
                        [
                            { type: "updateCharacter", id: "friend", pose: "excited" },
                            { type: "say", text: "You have to come see this!" },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "neutral" },
                            {
                                type: "say",
                                speaker: "yuki",
                                text: "Alright, alright. Lead the way.",
                            },
                        ],
                        [
                            { type: "transition", name: "slide", ms: 800 },
                            { type: "setBackground", id: "library" },
                        ],
                    ],
                    next: { slide: "a3" },
                },
                {
                    id: "a3",
                    initial: {
                        inherit: true,
                        textbox: {
                            speaker: "friend",
                            text: "Look at this old book I found!",
                        },
                    },
                    steps: [
                        [
                            { type: "updateCharacter", id: "friend", pose: "neutral" },
                            {
                                type: "say",
                                text: "It's about the history of our town, just like what we learned today.",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "surprised" },
                            {
                                type: "say",
                                speaker: "yuki",
                                text: "Wow, what a coincidence!",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "smile" },
                            { type: "say", text: "Let's read it together." },
                        ],
                    ],
                    next: { scene: "evening", slide: "e1" },
                },
            ],
        },
        {
            id: "evening",
            label: "Discovery",
            slides: [
                {
                    id: "e1",
                    initial: {
                        inherit: true,
                        textbox: { speaker: "yuki", text: "This book has so much detail!" },
                    },
                    steps: [
                        [
                            {
                                type: "say",
                                text: "Look, there are pictures of the old school building.",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "friend", pose: "worried" },
                            {
                                type: "say",
                                speaker: "friend",
                                text: "Wait... look at this page.",
                            },
                        ],
                        [
                            { type: "updateCharacter", id: "yuki", pose: "neutral" },
                            { type: "say", speaker: "yuki", text: "What is it?" },
                        ],
                        [
                            {
                                type: "say",
                                speaker: "friend",
                                text: "It mentions a hidden room in our school...",
                            },
                        ],
                    ],
                    next: { slide: "e2" },
                },
                {
                    id: "e2",
                    initial: {
                        inherit: true,
                        textbox: {
                            speaker: "yuki",
                            text: "A hidden room? That's incredible!",
                        },
                    },
                    steps: [
                        [
                            { type: "updateCharacter", id: "yuki", pose: "excited" },
                            { type: "say", text: "We should try to find it tomorrow!" },
                        ],
                        [
                            { type: "updateCharacter", id: "friend", pose: "excited" },
                            {
                                type: "say",
                                speaker: "friend",
                                text: "Yes! This could be the adventure we've been waiting for!",
                            },
                        ],
                        [
                            { type: "transition", name: "fade", ms: 1000 },
                            { type: "hideCharacter", id: "yuki" },
                            { type: "hideCharacter", id: "friend" },
                            { type: "say", text: "To be continued..." },
                        ],
                    ],
                    next: { scene: "dream", slide: "d1" },
                },
            ],
        },
        {
            id: "dream",
            label: "Dream Sequence",
            slides: [
                {
                    id: "d1",
                    initial: {
                        inherit: false,
                        background: "classroom_day",
                        backgroundBlur: 5,
                        textbox: {
                            speaker: "yuki",
                            text: "That night, Yuki had a strange dream...",
                        },
                    },
                    steps: [
                        [
                            {
                                type: "showCharacter",
                                slot: "center",
                                id: "yuki",
                                pose: "neutral",
                            },
                            { type: "say", text: "Everything feels so... hazy." },
                        ],
                        [
                            { type: "setBackground", id: "library", blur: 8 },
                            { type: "say", text: "The library from my dream..." },
                        ],
                        [
                            { type: "setBackground", id: "hallway", blur: 3 },
                            { type: "updateCharacter", id: "yuki", pose: "surprised" },
                            {
                                type: "say",
                                text: "Now I'm in the hallway, but it's all blurry.",
                            },
                        ],
                        [
                            { type: "setBackground", id: "classroom_evening", blur: 0 },
                            { type: "updateCharacter", id: "yuki", pose: "smile" },
                            {
                                type: "say",
                                text: "Ah, everything is clear now. Time to wake up!",
                            },
                        ],
                    ],
                },
            ],
        },
    ],
};
