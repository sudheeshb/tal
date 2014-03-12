/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */
(function () {
    /* jshint newcap: false, strict: false */
    this.CullingStripTest = AsyncTestCase("CullingStrip");

    this.CullingStripTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.CullingStripTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.CullingStripTest.prototype.testIsAWidgetStrip = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/strips/widgetstrip'
            ],
            function (application, CullingStrip, vertical, WidgetStrip) {
                var strip = new CullingStrip('test', vertical);
                assertTrue('Culling strip is a Widget Strip', strip instanceof WidgetStrip);
            }
        );
    };

    this.CullingStripTest.prototype.testHasNoDetachedWidgetsOnInit = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, CullingStrip, vertical) {
                var strip = new CullingStrip('test', vertical);
                assertFalse('Widgets detached on init', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasDetachedWidgetsAfterAppend = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget'
            ],
            function (application, CullingStrip, vertical, Widget) {
                this.sandbox.stub(Widget.prototype);
                var strip = new CullingStrip('test', vertical);
                strip.append(new Widget(), 50);
                assertTrue('Widgets detached on append', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasDetachedWidgetsAfterInsert = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget'
            ],
            function (application, CullingStrip, vertical, Widget) {
                this.sandbox.stub(Widget.prototype);
                var strip = new CullingStrip('test', vertical);
                strip.insert(0, new Widget(), 50);
                assertTrue('Widgets detached on insert', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasNoDetachedWidgetsAfterLastRemoved = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                var widget = new Widget();
                strip.append(widget, 50);
                strip.remove(widget);
                assertFalse('Widgets detached after last removed', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testHasNoDetachedWidgetsAfterAllRemoved = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                var widgets;
                this.stubAppAndDevice(application, Device, Widget);
                var strip = new CullingStrip('test', vertical);
                widgets = this.createWidgets(2, Widget);
                this.stubRenderOn(widgets);
                this.appendAllTo(strip, widgets, 40);
                strip.removeAll();
                assertFalse('Widgets not detached after all removed', strip.needsVisibleIndices());
            }
        );
    };

    this.CullingStripTest.prototype.testInitCallsSuper = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/strips/widgetstrip'
            ],
            function (application, CullingStrip, vertical, WidgetStrip) {
                this.sandbox.spy(WidgetStrip.prototype, 'init');
                var strip = new CullingStrip('test', vertical);
                sinon.assert.calledWith(
                    WidgetStrip.prototype.init,
                    'test',
                    vertical
                );
            }
        );
    };

    this.CullingStripTest.prototype.testAppendCallsSuper = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/widget'
            ],
            function (application, CullingStrip, vertical, WidgetStrip, Widget) {
                this.sandbox.stub(Widget.prototype);
                this.sandbox.spy(WidgetStrip.prototype, 'append');
                var strip = new CullingStrip('test', vertical);
                strip.append(new Widget(), 50);
                sinon.assert.calledWith(
                    WidgetStrip.prototype.append,
                    sinon.match.instanceOf(Widget),
                    50
                );
            }
        );
    };

    this.CullingStripTest.prototype.testWidgetNotRenderedOnAppend = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                this.sandbox.spy(Widget.prototype, 'render');
                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};
                strip.append(new Widget());
                sinon.assert.notCalled(Widget.prototype.render);
            }
        );
    };

    this.CullingStripTest.prototype.testAttachIndexedWidgetsRendersIndexedWidgetWithoutOutputElements = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                var widget = new Widget('test');
                this.sandbox.stub(widget, 'render');
                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};
                strip.append(widget);
                strip.attachIndexedWidgets([0]);
                sinon.assert.calledOnce(widget.render);
            }
        );
    };

    this.CullingStripTest.prototype.testAttachIndexedWidgetsDoesNotReRenderAttachedWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};

                widgets = this.createWidgets(2, Widget);
                this.stubRenderOn(widgets);
                this.appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1]);

                this.resetRenderOn(widgets);

                strip.attachIndexedWidgets([0, 1]);
                sinon.assert.calledOnce(widgets[0].render); // indexed & not already attached
                sinon.assert.notCalled(widgets[1].render); // already attached
            }
        );
    };

    this.CullingStripTest.prototype.testAttachIndexedWidgetsDetachesNonIndexedAttachedWidgets = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {};

                widgets = this.createWidgets(3, Widget);
                this.stubRenderOn(widgets);
                this.appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1]);

                this.resetRenderOn(widgets);

                strip.attachIndexedWidgets([0, 2]);
                sinon.assert.calledWith(
                    Device.prototype.removeElement,
                    widgets[1].outputElement
                );
                sinon.assert.neverCalledWith(
                    Device.prototype.removeElement,
                    widgets[0].outputElement
                );
                sinon.assert.neverCalledWith(
                    Device.prototype.removeElement,
                    widgets[2].outputElement
                );
            }
        );
    };

    this.CullingStripTest.prototype.testWidgetsBeforeCurrentlyAttachedBlockPrepended = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = this.createWidgets(4, Widget);
                this.stubRenderOn(widgets);
                this.appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([1, 2]);
                Device.prototype.prependChildElement.reset();
                strip.attachIndexedWidgets([0, 3]);

                sinon.assert.calledWith(
                    Device.prototype.prependChildElement,
                    strip.outputElement,
                    widgets[0].outputElement
                );

                sinon.assert.neverCalledWith(
                    Device.prototype.appendChildElement,
                    strip.outputElement,
                    widgets[0].outputElement
                );

            }
        );
    };

    this.CullingStripTest.prototype.testRenderCausesWidgetsToReRenderOnAttach = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, CullingStrip, vertical, Widget, Device) {
                this.stubAppAndDevice(application, Device, Widget);
                var widgets;

                var strip = new CullingStrip('test', vertical);
                strip.outputElement = {id: 'strip'};

                widgets = this.createWidgets(1, Widget);
                this.stubRenderOn(widgets);
                this.appendAllTo(strip, widgets, 40);

                strip.attachIndexedWidgets([0]);
                this.resetRenderOn(widgets);
                sinon.assert.notCalled(
                    widgets[0].render
                );
                strip.render(new Device());
                sinon.assert.notCalled(
                    widgets[0].render
                );
                strip.attachIndexedWidgets([0]);
                sinon.assert.calledOnce(
                    widgets[0].render
                );

            }
        );
    };

    this.CullingStripTest.prototype.stubAppAndDevice = function (application, Device, Widget) {
        this.sandbox.stub(Device.prototype);
        this.sandbox.stub(application);
        this.sandbox.stub(Widget.prototype, 'getCurrentApplication').returns(application);
        application.getDevice.returns(new Device());
    };

    this.CullingStripTest.prototype.appendAllTo = function (strip, widgetArray, widgetsLength) {
        var i, widget;
        for (i = 0; i !== widgetArray.length; i += 1) {
            widget = widgetArray[i];
            strip.append(widget, widgetsLength);
        }
    };

    this.CullingStripTest.prototype.stubRenderOn = function (renderableObjectArray) {
        var i, renderable;
        function renderStub() {
            this.outputElement = {id: this.id};
        }

        for (i = 0; i !== renderableObjectArray.length; i += 1) {
            renderable = renderableObjectArray[i];
            this.sandbox.stub(renderable, 'render', renderStub);
        }
    };

    this.CullingStripTest.prototype.resetRenderOn = function (renderableSpiedObjectArray) {
        var i, renderable;
        for (i = 0; i !== renderableSpiedObjectArray.length; i += 1) {
            renderable = renderableSpiedObjectArray[i];
            renderable.render.reset();
        }
    };

    this.CullingStripTest.prototype.createWidgets = function (numberOfWidgets, Widget) {
        var i, widget, widgets;
        widgets = [];
        for (i = 0; i !== numberOfWidgets; i += 1) {
            widget = new Widget('test' + i);
            widgets.push(widget);
        }
        return widgets;
    };
}());