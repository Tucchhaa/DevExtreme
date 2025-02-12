import $ from 'jquery';

import Avatar from '__internal/ui/chat/avatar';

const AVATAR_CLASS = 'dx-avatar';
const AVATAR_IMAGE_CLASS = 'dx-avatar-image';
const AVATAR_INITIALS_CLASS = 'dx-avatar-initials';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new Avatar($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('Avatar classes', moduleConfig, () => {
    QUnit.test('root element should have correct class', function(assert) {
        assert.strictEqual(this.$element.hasClass(AVATAR_CLASS), true);
    });

    QUnit.test('image element should have correct class', function(assert) {
        this.reinit({ url: 'url' });

        assert.strictEqual(this.$element.children().first().hasClass(AVATAR_IMAGE_CLASS), true);
    });

    QUnit.test('text element should have correct class', function(assert) {
        this.reinit({ name: 'name' });

        assert.strictEqual(this.$element.children().first().hasClass(AVATAR_INITIALS_CLASS), true);
    });

    QUnit.test('text element should be rendered if name is null, undefined or empty', function(assert) {
        this.reinit({ name: null });
        assert.strictEqual(this.$element.children().first().length, 1);

        this.reinit({ name: undefined });
        assert.strictEqual(this.$element.children().first().length, 1);

        this.reinit({ name: '' });
        assert.strictEqual(this.$element.children().first().length, 1);
    });
});
