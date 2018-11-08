import { state } from '../shared/state';

import { Document, Schema, Model, model } from 'mongoose';

interface Rate {
    value: number;
    timestamp: number;
}

interface Payment {
	amount: number;
	currency: string;
	to: string; // "адрес btc"
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
        default: 0
    }

}, {
        timestamps: true
    }
);

const exchangeAutomaton: Model<ExchangeAutomatonModel> = model<ExchangeAutomatonModel>('ExchangeAutomaton', exchangeAutomatonSchema);


export class ExchangeAutomaton {

    private _id: string;

    private currencyName: string;

    private payment: {
		minAmount: number,
		maxAmount: number
    };

    private rate: Rate;

    public available: number;

    constructor() { }

    public init() {
        return new Promise ((resolve, reject) => {
            console.log('Creating a service...');
            exchangeAutomaton.create(state).then((result: ExchangeAutomatonModel) => {
                this._id = result._id;
                this.currencyName = result.currencyName;
                this.rate = result.rate;
                this.payment = result.payment;
                this.available = result.available;
                resolve(result);
            }).catch(
                err => {
                   reject(err);
                }
            );
        });
    }

    public withdaw(payment: Payment) {
        return new Promise ((resolve, reject) => {
            if (payment.currency === 'btc') {
                if (payment.amount >= this.payment.minAmount &&
                    payment.amount <= this.payment.maxAmount &&
                    payment.amount <= this.available) {

                        exchangeAutomaton.findByIdAndUpdate(this._id,
                            {
                                $set: {'available': (this.available - payment.amount)}
                            }, {
                                new: true
                            }).then((result: ExchangeAutomatonModel) => {
                            this.available = result.available;
                            resolve(result);
                        }).catch(
                            err => {
                                reject(err);
                            }
                        );
                }
            } else if (payment.currency === 'usd') {

            } else {
                let err = new Error('Unknown currency.');
                reject(err);
            }
        });
    }


    public setMinAmount (amount: number) {
        return new Promise ((resolve, reject) => {
            exchangeAutomaton.findByIdAndUpdate(this._id,
                {
                    $set: {'payment.minAmount': amount}
                }, {
                    new: true
                }).then((result: ExchangeAutomatonModel) => {
                this.payment.minAmount = amount;
                resolve(result);
            }).catch(
                err => {
                    reject(err);
                }
            );
        });
    }

    public setMaxAmount (amount: number) {
        return new Promise ((resolve, reject) => {
            exchangeAutomaton.findByIdAndUpdate(this._id,
                {
                    $set: {'payment.maxAmount': amount}
                }, {
                    new: true
                }).then((result: ExchangeAutomatonModel) => {
                this.payment.maxAmount = amount;
                resolve(result);
            }).catch(
                err => {
                    reject(err);
                }
            );
        });
    }

    public setRate (rate: Rate) {
        return new Promise ((resolve, reject) => {
            exchangeAutomaton.findByIdAndUpdate(this._id,
                {
                    $set: {'rate': rate}
                }, {
                    new: true
                }).then((result: ExchangeAutomatonModel) => {
                this.rate = rate;
                resolve(result);
            }).catch(
                err => {
                    reject(err);
                }
            );
        });
    }
}
