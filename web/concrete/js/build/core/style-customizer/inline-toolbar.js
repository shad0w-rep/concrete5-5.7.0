(function(global, $) {
    'use strict';

    function ConcreteInlineStyleCustomizer($element, options) {
        var my = this;
        options = $.extend({
        }, options);

        my.options = options;
        my.$element = $element;
        my.$toolbar = my.$element.find('>ul');

        my.setupForm();
        my.setupButtons();
    }

    ConcreteInlineStyleCustomizer.prototype = {

        setupForm: function() {
            var my = this;
            my.$element.concreteAjaxForm({
                success: function(resp) {
                    var editor = new Concrete.getEditMode(),
                        area = editor.getAreaByID(resp.aID),
                        block = area.getBlockByID(parseInt(resp.originalBlockID)),
                        arEnableGridContainer = area.getEnableGridContainer() ? 1 : 0,
                        action = CCM_DISPATCHER_FILENAME + '/ccm/system/block/render';

                    $.get(action, {
                            arHandle: area.getHandle(),
                            cID: resp.cID,
                            bID: resp.bID,
                            arEnableGridContainer: arEnableGridContainer
                        }, function (r) {
                            ConcreteToolbar.disableDirectExit();
                            var newBlock = block.replace(resp.bID, r);
                            ConcreteAlert.notify({
                                'message': resp.message
                            });

                            editor.destroyInlineEditModeToolbars();

                            ConcreteEvent.fire('EditModeExitInlineComplete', {
                                block: newBlock
                            });
                    });
                },

                error: function(r) {
                    my.$toolbar.prependTo('#ccm-inline-toolbar-container').show();
                }
            });
        },

        setupButtons: function() {
            var my = this;
            my.$toolbar.on('click.inlineStyleCustomizer', 'button[data-action=cancel-design]', function() {
                my.$element.hide();
                ConcreteEvent.fire('EditModeExitInline');
                return false;
            });

            my.$toolbar.on('click.inlineStyleCustomizer', 'button[data-action=save-design]', function() {
                // move the toolbar back into the form so it submits. so great.
                my.$toolbar.hide().prependTo(my.$element);
                my.$element.submit();
                ConcreteEvent.unsubscribe('EditModeExitInlineComplete');
                return false;
            });
        }

    }

    // jQuery Plugin
    $.fn.concreteInlineStyleCustomizer = function (options) {
        return $.each($(this), function (i, obj) {
            new ConcreteInlineStyleCustomizer($(this), options);
        });
    }

    global.ConcreteInlineStyleCustomizer = ConcreteInlineStyleCustomizer;

})(this, $);
