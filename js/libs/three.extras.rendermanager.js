/*
 * @author Yang Su
 * THREE.Extras.RenderManager helps handling multiple scenes, cameras and render loops.
 *
 * Based on the RenderManager created by Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */

THREE = THREE || {};
THREE.Extras = THREE.Extras || {};

THREE.Extras.RenderManager = function (renderer) {
    this.renderer = renderer;
    this.time = Date.now() / 1000;

    this.renders = {};
    this.current = {};
    this.size = 0;
};

THREE.Extras.RenderManager.prototype.add = function (id, ctx, render, onload, onunload) {
    this.renders[id] = {
        id: id,
        ctx: ctx,
        render: render,
        onload: onload,
        onunload: onunload
    };

    if (this.size === 0) {
        this.current = this.renders[id];
    }

    this.size += 1;
};

THREE.Extras.RenderManager.prototype.get = function (id) {
    return this.renders[id];
};

THREE.Extras.RenderManager.prototype.remove = function (id) {
    if (this.renders[id]) {
        delete this.renders[id];
        this.size -= 1;
    }
};

THREE.Extras.RenderManager.prototype.renderCurrent = function () {
    if (this.current && this.current.render) {
        var now = Date.now() / 1000,
            delta = now - this.time;
        this.time = now;

        this.current.render.call(this.current.ctx, delta, this.renderer);
    } else {
        console.warn('RenderManager: No current render defined.');
    }
};

THREE.Extras.RenderManager.prototype.setCurrent = function (id) {
    if (this.current && this.current.onunload) {
        this.current.onunload.call(this.current.ctx);
    }
    if (this.renders[id]) {
        this.current = this.renders[id];
        if (this.current.onload) {
            this.current.onload.call(this.current.ctx);
        }
    } else {
        console.warn('RenderManager: Render "' + id + '" not found.');
    }
};