import type { Story } from "../types/story";
import intro from './scenes/intro'
import kittens from './scenes/kittens'
import green_box from './scenes/green_box'
import cafe from './scenes/cafe'
import gardenia from './scenes/gardenia'

const story: Story = {
    version: "1.0",
    meta: {
        id: "birthday-story",
        title: "З днем Народження!",
    },
    assets: {
        backgrounds: {
            room: "/bg/room.avif",
            home_prize: "/bg/home_prize.avif",
            nature: "/bg/nature.avif",
            bathroom: '/bg/bathroom.avif',
            green_box: '/bg/green_box.avif',
            cafe: '/bg/cafe.avif',
            cafe_inside: '/bg/cafe_inside.avif',
            gardenia: '/bg/gardenia.avif'
        },
        characters: {
            unknown: {
                name: '?????',
                poses: {}
            },
            vitalik: {
                name: 'Віталік',
                speaker_color: "#41dc8e",
                poses: {
                    shadow: '/ch/shadow.avif',
                    surprised: '/ch/surprised.avif',
                    default: '/ch/default.avif',
                    cast: '/ch/cast.avif',
                    idk: '/ch/idk.avif',
                    think: '/ch/think.avif',
                    whisper: '/ch/whisper.avif',
                    turn: '/ch/turn.avif'
                }
            },
            red: {
                name: 'Рижик',
                speaker_color: "#ffffff",
                poses: {
                    default: '/ch/cat.avif'
                }
            },
            mouse: {
                name: 'Мишоль',
                speaker_color: '#A020F0',
                poses: {
                    default: '/ch/mouse.avif'
                }
            },
            carrot: {
                name: 'Марʼяна',
                speaker_color: '#FF4D00',
                poses: {
                    default: '/ch/carrot.avif'
                }
            },
            angel: {
                name: "Рафаель",
                speaker_color: "#ADD8E6",
                poses: {
                    neutral: "/ch/angel.avif",
                },
            },
        },
    },
    scenes: [
        intro,
        kittens,
        green_box,
        cafe,
        gardenia
    ],
};

export default story;
