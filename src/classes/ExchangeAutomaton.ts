import { state } from '../shared/state';

import { Document, Schema, Model, model } from 'mongoose';

interface Rate {
    value: number;
    timestamp: number;
}

interface ExchangeAutomatonInterface {
    currencyName: string;
    payment: {
        minAmount: number,
        maxAmount: number
    };
    rate: Rate;
    available: number;
}

interface Payment {
	amount: number;
	currency: string;
	to: string; // "адрес btc"
}

interface ExchangeAutomatonModel extends ExchangeAutomatonInterface, Document {
}

const exchangeAutomatonSchema = new Schema({
    currencyName: {
        type: String,
        required: true
    },
    payment: {
        minAmount: {
            type: Number,
            required: true
        },
        maxAmount: {
            type: Number,
            required: true
        }
    },
    rate: {
		value: {
            type: Number,
            required: true
        },
		timestamp: {
            type: Number,
            required: true
        }
    },
    available: {
        type: Number,
        required: true
    }

}, {
        timestamps: true
    }
);

const exchangeAutomaton: Model<ExchangeAutomatonModel> = model<ExchangeAutomatonModel>('ExchangeAutomaton', exchangeAutomatonSchema);


export class ExchangeAutomaton {

    private state: ExchangeAutomatonModel;

    constructor() { }

    public async init() {
        const newState = await exchangeAutomaton.create(state);
        this.state = newState;
        return this.getState();
    }

    public getState() {
        return this.state;
    }

    public async withdraw(payment: Payment) {
        if (payment.currency === 'btc') {

            if (payment.amount >= this.state.payment.minAmount &&
                payment.amount <= this.state.payment.maxAmount &&
                payment.amount <= this.state.available) {
                    const newState = await exchangeAutomaton.findByIdAndUpdate(this.state._id, {
                        $set: {'available': (this.state.available - payment.amount)}
                    }, {
                        new: true
                    });
                    this.state = newState;
                    return this.getState();
            } else {

            }

        } else if (payment.currency === 'usd') {

        } else {
            let err = new Error('Unknown currency.');
            throw err;
        }
    }


    //     });
    // }


    // public setMinAmount (amount: number) {
    //     return new Promise ((resolve, reject) => {
    //         exchangeAutomaton.findByIdAndUpdate(this._id,
    //             {
    //                 $set: {'payment.minAmount': amount}
    //             }, {
    //                 new: true
    //             }).then((result: ExchangeAutomatonModel) => {
    //             this.payment.minAmount = amount;
    //             resolve(result);
    //         }).catch(
    //             err => {
    //                 reject(err);
    //             }
    //         );
    //     });
    // }

    // public setMaxAmount (amount: number) {
    //     return new Promise ((resolve, reject) => {
    //         exchangeAutomaton.findByIdAndUpdate(this._id,
    //             {
    //                 $set: {'payment.maxAmount': amount}
    //             }, {
    //                 new: true
    //             }).then((result: ExchangeAutomatonModel) => {
    //             this.payment.maxAmount = amount;
    //             resolve(result);
    //         }).catch(
    //             err => {
    //                 reject(err);
    //             }
    //         );
    //     });
    // }

    // public setRate (rate: Rate) {
    //     return new Promise ((resolve, reject) => {
    //         exchangeAutomaton.findByIdAndUpdate(this._id,
    //             {
    //                 $set: {'rate': rate}
    //             }, {
    //                 new: true
    //             }).then((result: ExchangeAutomatonModel) => {
    //             this.rate = rate;
    //             resolve(result);
    //         }).catch(
    //             err => {
    //                 reject(err);
    //             }
    //         );
    //     });
    // }
}
