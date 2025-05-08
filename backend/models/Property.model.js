import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const PropertySchema = new Schema({
    active: {
        type: Boolean,
        default: true,
    },
    title: {
        type: String,
        trim: true
    },
    hostName: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    selfcheckin: {
        type: String,
        trimg: true
    },
    coverImage: {
        type: String,
        trim: true,
    },
    wifi: {
        password: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true
        }
    },
    location: {
        type: String,
        trim: true,
    },
    contacts: [{
        name: {
            type: String,
            trim: true
        },
        info: {
            type: String,
            trim: true
        }
    }],
    perks: [{
        type: String,
        trim: true
    }],
    perkInfo: {
        type: Map,
        of: String
    },
    quickResponse: [{
        icon: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        number: {
            type: String,
            trim: true
        }
    }],
    foodAndDrinks: [{
        tag: {
            type: String,
            trim: true
        },
        title: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        img: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            trim: true
        }
    }],
    houseRules: [{
        heading: {
            type: String,
            trim: true,
        },
        rules: [String]
    }],
    faqs: [{
        question: {
            type: String,
            trim: true
        },
        answer: {
            type: String,
            trim: true
        }
    }],
    questions: [{
        type: {
            type: String,
            enum: ['fill-up', 'multiple-choice'],
            required: true
        },
        questionText: {
            type: String,
            required: true,
            trim: true
        },
        options: {
            type: [String],
            default: null,
            validate: {
                validator: function (v) {
                    if (this.type === 'multiple-choice') {
                        return Array.isArray(v) && v.length > 0;
                    }
                    return true;
                },
                message: 'Multiple choice questions must have at least one option'
            }
        }
    }],
    info: {
        type: String,
        trim: true
    },
    kitchenItems: [{
        type: String,
        trim: true
    }],
    appliancesItems: [{
        type: String,
        trim: true
    }],
    images: [{
        url: {
            type: String,
        },
        description: {
            type: String,
            trim: true
        },
        file: {
            type: String,
        }
    }]
}, {
    timestamps: true
});

export const Propertymodel = mongoose.model('Property', PropertySchema);
