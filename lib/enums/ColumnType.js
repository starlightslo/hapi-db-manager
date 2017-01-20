'use strict';

const Integer = 'integer';
const String = 'string';
const Text = 'text';
const BigInteger = 'bigInteger';
const Float = 'float';
const Boolean = 'boolean';
const Date = 'date';
const DateTime = 'dateTime';
const Time = 'time';
const Timestamp = 'timestamp';

module.exports = class ColumnType {

    static get Integer() {

        return Integer;

    }

    static get String() {

        return String;

    }

    static get Text() {

        return Text;

    }

    static get BigInteger() {

        return BigInteger;

    }

    static get Float() {

        return Float;

    }

    static get Boolean() {

        return Boolean;

    }

    static get Date() {

        return Date;

    }

    static get DateTime() {

        return DateTime;

    }

    static get Time() {

        return Time;

    }

    static get Timestamp() {

        return Timestamp;

    }

    static get All() {

        return [Integer, String, Text, BigInteger, Float, Boolean, Date, DateTime, Time, Timestamp];

    }

};
