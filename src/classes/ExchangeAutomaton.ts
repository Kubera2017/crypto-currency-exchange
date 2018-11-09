import { state } from '../shared/state';

import { Document, Schema, Model, model } from 'mongoose';

import { BTCAddress } from './BTCAddress';

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

export interface PaymentRequest {
    amount: number;
	currency: string;
    to: string;
}

export class Payment {
	amount: number;
	currency: string;
    to: BTCAddress;

    constructor(request: PaymentRequest) {
        this.amount = request.amount;
        this.currency = request.currency;
        this.to = new BTCAddress(request.to);
    }
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
        let demand = payment.amount;
        if (payment.currency === 'usd') {
            demand = payment.amount / this.state.rate.value;
        }
        console.log(demand);
        console.log(payment);


        const errors = [];
        if (demand < this.state.payment.minAmount) {
            errors.push({message: 'minAmount error'});
        }
        if (demand > this.state.payment.maxAmount) {
            errors.push({message: 'maxAmount error'});
        }
        if (demand > this.state.available) {
            errors.push({message: 'available error'});
        }

        if (errors.length !== 0) {
            return {status: 'error', errors: errors};
        } else {

            const newState = await exchangeAutomaton.findByIdAndUpdate(this.state._id, {
                    $set: {'available': (this.state.available - demand)}
            }, { new: true });

            this.state = newState;

            return {status: 'ok'};
        }
    }
}
