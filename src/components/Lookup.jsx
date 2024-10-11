import * as MATH from "../utils/mathUtils";

//////////////////////////////////////////////////////////////
////////////////  GAME DEVELOPMENT LOOKUP  ///////////////////
//////////////////////////////////////////////////////////////


export const gameDevelopmentTextures = {
    main: 'src/assets/game_development/background.png',
    game1: 'src/assets/game_development/summoners_crucible.png',
    game1MoreInfo: 'src/assets/game_development/summoners_more_info.png',
    game2: 'src/assets/game_development/beneath_the_clouds.png',
    game2MoreInfo: 'src/assets/game_development/beneath_more_info.png',
};

export const gameDevelopment = {

    /// MAIN PAGE ///
    main: {
        root: true,
        texture: 'main',
        pageIndex: 0,
        children: [
            "game1",
            "game2"
        ]
    },

    /// SUMMONER'S CRUCIBLE ///
    game1: {
        root: false,
        texture: 'game1',
        pageIndex: 0,
        position: [0.95, 2.25, 1],
        rotation: MATH.toRadiansArray([0, 180, 0]),
        size: [0.1, 0.1],
        parent: "main",

        children: [
            "game1MoreInfo"
        ]
    },

    game1MoreInfo: {
        root: false,
        texture: 'game1MoreInfo',
        pageIndex: 1,
        position: [0.95, 2.25, 1],
        rotation: MATH.toRadiansArray([0, 180, 0]),
        size: [0.1, 0.1],
        parent: "game1",

        children: []
    },

    /// BENEATH THE CLOUDS ///
    game2: {
        root: false,
        texture: 'game2',
        pageIndex: 0,
        position: [1.2, 2.4, 1],
        rotation: MATH.toRadiansArray([0, 180, 0]),
        size: [0.1, 0.1],
        parent: "main",

        children: [
            "game2MoreInfo"
        ]
    },

    game2MoreInfo: {
        root: false,
        texture: 'game2MoreInfo',
        pageIndex: 1,
        position: [1.2, 2.4, 1],
        rotation: MATH.toRadiansArray([0, 180, 0]),
        size: [0.1, 0.1],
        parent: "game2",

        children: []
    },

    back: {
        root: false,
        position: [1.2, 2.25, 1],
        rotation: MATH.toRadiansArray([0, 180, 0]),
        size: [0.1, 0.1],
    }
};