'use strict';

const amqp = require('amqplib');
const sysConfig = require('../configs/system-configs');
const log = sysConfig.log();

class EventUtil {

    constructor() {
        log.info('--------------- INIT EVENT-UTIL CLASS ---------------');
    }

    // Emit event to service: Mailer - send reprise email
    emitSendEmail(templateId, recipient) {
        log.info('[AMQP][EMIT_SEND_EMAIL-Emitter] start emit event to message broker');

        amqp.connect(`amqp://${sysConfig.msmqUsername}:${sysConfig.msmqPassword}${sysConfig.msmqHost}?heartbeat=60/`)
            .then(conn => {
                log.info('[AMQP][EMIT_SEND_EMAIL-Emitter] Successfully connected to message broker server');

                return conn.createChannel()
                    .then(ch => {
                        const ex = sysConfig.msmqSendMarketingEmailExchange;
                        const key = sysConfig.msmqSendMarketingEmailBindingKey;

                        const msgObj = {
                            recipient,
                            template_id: templateId
                        };

                        let msg = JSON.stringify(msgObj);
                        let ok = ch.assertExchange(ex, 'topic', {durable: true});

                        return ok.then(() => {
                            ch.publish(ex, key, Buffer.from(msg), {persistent: true});
                            log.info(`[AMQP][EMIT_SEND_EMAIL-Emitter] Sent ${key}: ${msg}`);

                            return ch.close();
                        });
                    }).finally(() => {
                        return conn.close();
                    });
            })
            .catch(err => {
                log.error(`[AMQP][EMIT_SEND_EMAIL-Emitter] Can't connect to message broker server. ${err}`);
            });
    }


}

module.exports = new EventUtil();
