import { Request } from 'express';
import { UsersTable } from '../database/models';

export interface MySQL_Default_Response {
    insertId: number;
    affectedRows: number;
}

// Add Books, Categories, Users, ReqUser

export interface ReqUser extends Request {
    user?: Users;
}

// * CREATED DB

export interface Users {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    _created?: string,
    isVerified?: boolean | number
    //coreValues?: UserValues
}


// ! JOIN Users and userMetrics ON userid
export interface UserTopValues {

    userid?: Users['id'];
    value_1?: userMetrics,
    value_2?: userMetrics,
    value_3?: userMetrics,
    value_4?: userMetrics,
    value_5?: userMetrics,
    value_6?: userMetrics,
    value_7?: userMetrics,
    value_8?: userMetrics,
    value_9?: userMetrics,
    value_10?: userMetrics
}





// * CREATED DB
export interface userMetrics {

    userid?: Users['id'];
    valueid?: LifeValues['id'];
    personal_definition?: string; //pass 5
    congruence_rating?: number; // pass 6
    level_ten_definition?: string; //pass 7
    priority?: number;  // pass 8 core logic
    percent_positive?: number;  // pass 9
    percent_negative?: number;  // pass 9
    is_lower_self?: boolean; //
    habit_1?: string;
    habit_2?: string;
    habit_3?: string;
}

export interface userMetricsJoined {

    userid?: Users['id'];
    valueid?: LifeValues['id'];
    personal_definition?: string; //pass 5
    congruence_rating?: number; // pass 6
    level_ten_definition?: string; //pass 7
    priority?: number;  // pass 8 core logic
    percent_positive?: number;  // pass 9
    percent_negative?: number;  // pass 9
    is_lower_self?: boolean; //
    habit_1?: string;
    habit_2?: string;
    habit_3?: string;
    value_name?: string;
    id?: number;
    habit?: string;
    _created?: string;
    habitScore?: number;
}




export interface UserHabits {
    id?: number;
    valueid?: LifeValues['id'];
    userid?: Users['id'];
    habit?: string;
    _created?: string;
    habitScore?: number;

}


export interface Payload extends UsersTable {
    id?: number;
    role?: number;
}





// export interface LifeValues {
//     id: number,
//     valueName: string,
//     isLowerSelf: boolean

// }

export interface LifeValues {
    id: number;
    value_name: "Adventure" | "Art" | "Beauty" | "Being Liked/Approval" | "Certainty" | "Clarity" | "Comfort" | "Communication" | "Community" | "Connection" | "Consciousness/Awareness" | "Contribution/Impact" | "Control" | "Courage/Bravery" | "Creativity/Ingenuity" | "Elegance/Simplicity" | "Equality/Fairness" | "Excellence" | "Excitement" | "Faith/Religion/Worship/God" | "Family" | "Fame/Celebrity" | "Focus" | "Freedom" | "Friendship" | "Fun" | "Gratitude" | "Health/Vigor/Energy" | "Honesty" | "Honor" | "Humor/Laughter " | "Independence" | "Joy" | "Justice" | "Knowledge/Learning/Understanding" | "Kindness/Generosity" | "Leadership" | "Love/Romance/Intimacy" | "Loyalty/Commitment " | "Luxury" | "Modesty/Humility" | "Nature" | "Order" | "Openmindedness/Perspective" | "Optimism/Positivity/Hope" | "Passion/Enthusiasm" | "Personal Growth/Self-Improvement" | "Peace of Mind/Tranquility/Calm" | "Physical Appearance" | "Playfulness/Spontaneity" | "Power" | "Productivity/Efficiency" | "Progress" | "Professionalism" | "Purpose" | "Recognition/Reputation/Prestige" | "Respect" | "Safety/Security" | "Service/Helping Others" | "Self-Control/Temperance" | "Self-Expression" | "Significance" | "Spirituality" | "Status" | "Strength" | "Society/Culture/State/Country" | "Sex" | "Success/Achievement" | "Tradition" | "Travel" | "Teamwork/Collaboration" | "Trust" | "Truth/Reality" | "Uniqueness" | "Variety/Newness/Novelty" | "Wealth/Money" | "Wisdom";
    is_lower_self: boolean;
}





