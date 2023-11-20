/**
 * CAUTION!!! PERFORMANCE HIT!!! USE WITH CARE!!!
 * 
 * Lock based on promises.
 * The lock allows only single "action" to be performed at a time.
 * 
 * Reasoning: Keeping front-end, user inputs and actual fs/file content in sync has 
 * unavoidable race conditions in event based system.
 * 
 * Acquire itself is a cheap operation, losing some "actions", which is a rare case, to avoid race conditions
 * and possible bad state is a good enough reason to have this.
 */
class SingleActionLock {
    locked: boolean;

    constructor() {
        this.locked = false;
    }

    async acquire() {
        return new Promise<void>((resolve) => {
            const tryAcquire = () => {
                if (!this.locked) {
                    this.locked = true;
                    resolve();
                } else {
                    console.warn("Action lock is already acquired, rejecting");
                    throw new Error("Single action at a time");
                }
            };

            tryAcquire();
        });
    }

    release() {
        this.locked = false;
    }
}

export {
    SingleActionLock,
}
