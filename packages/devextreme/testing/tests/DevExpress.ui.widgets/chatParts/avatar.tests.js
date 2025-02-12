import $ from 'jquery';

import ChatAvatar from '__internal/ui/chat/avatar';

const AVATAR_IMAGE_CLASS = 'dx-avatar-image';
const AVATAR_INITIALS_CLASS = 'dx-avatar-initials';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.instance = new ChatAvatar($('#component'), options);
            this.$element = $(this.instance.$element());
        };

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        init();
    }
};

QUnit.module('ChatAvatar', moduleConfig, () => {
    QUnit.module('Render', () => {
        QUnit.test('should be initialized with correct type', function(assert) {
            assert.ok(this.instance instanceof ChatAvatar);
        });

        QUnit.test('should be rendered with UU value by default', function(assert) {
            assert.strictEqual(this.$element.text(), 'UU');
        });
    });

    QUnit.module('Name option', () => {
        QUnit.test('should be rendered with correct initials according passed name option value', function(assert) {
            this.reinit({ name: 'User name' });

            assert.strictEqual(this.$element.text(), 'UN');
        });

        QUnit.test('name option should be updatable at runtime', function(assert) {
            this.instance.option('name', 'New Value');

            assert.strictEqual(this.$element.text(), 'NV');
        });

        [
            { name: 'onewordname', expectedInitials: 'O' },
            { name: 'Three word name', expectedInitials: 'TW' },
            { name: ' New Value', expectedInitials: 'NV' },
            { name: '   New      Value.   ', expectedInitials: 'NV' },
            { name: '', expectedInitials: '' },
            { name: 888, expectedInitials: '8' },
            { name: undefined, expectedInitials: '' },
            { name: null, expectedInitials: '' },
            { name: NaN, expectedInitials: 'N' },
            { name: Infinity, expectedInitials: 'I' },
            { name: -Infinity, expectedInitials: '-' },
            { name: { firstName: 'name' }, expectedInitials: '[O' }
        ].forEach(({ name, expectedInitials }) => {
            QUnit.test(`name option is ${name}`, function(assert) {
                this.reinit({ name });

                assert.strictEqual(this.$element.text(), expectedInitials);
            });
        });

        QUnit.test('initials element should not be rendered if url is not empty', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
            });

            const $initials = this.$element.find(`.${AVATAR_INITIALS_CLASS}`);

            assert.strictEqual($initials.length, 0);
        });

        QUnit.test('initials element should be rendered if url became empty in runtime', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
            });

            this.instance.option({ url: '' });

            const $initials = this.$element.find(`.${AVATAR_INITIALS_CLASS}`);

            assert.strictEqual($initials.length, 1);
        });

        QUnit.test('initials element should not be rendered if url became not empty in runtime', function(assert) {
            this.reinit({
                name: 'User name',
            });

            this.instance.option({ url: 'url' });

            const $initials = this.$element.find(`.${AVATAR_INITIALS_CLASS}`);

            assert.strictEqual($initials.length, 0);
        });
    });

    QUnit.module('Image rendering', {
        beforeEach: function() {
            this.getImage = () => this.$element.find(`.${AVATAR_IMAGE_CLASS}`);
        }
    }, () => {
        QUnit.test('img element should not be rendered if url is empty', function(assert) {
            assert.strictEqual(this.getImage().length, 0);
        });

        QUnit.test('img element should not be rendered if url became empty in runtime', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
            });

            this.instance.option({ url: '' });

            assert.strictEqual(this.getImage().length, 0);
        });

        QUnit.test('img should have default alt attribute if alt and name is not defined', function(assert) {
            this.reinit({
                name: '',
                url: 'url',
            });

            assert.strictEqual(this.getImage().attr('alt'), 'Avatar');
        });

        QUnit.test('img alt should be set to "alt" option value if it is passed', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
                alt: 'Test Name'
            });

            assert.strictEqual(this.getImage().attr('alt'), 'Test Name');
        });

        QUnit.test('img alt should be set to "name" option if it is passed but "alt" is not passed', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
            });

            assert.strictEqual(this.getImage().attr('alt'), 'User name');
        });

        QUnit.test('img element should have correct alt attribute if alt was changed in runtime', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
                alt: 'Test Name'
            });

            this.instance.option({ alt: 'New name' });

            assert.strictEqual(this.getImage().attr('alt'), 'New name');
        });

        QUnit.test('img element should have correct alt attribute if name was changed in runtime', function(assert) {
            this.reinit({
                name: 'User name',
                url: 'url',
            });
            this.instance.option({ name: 'New name' });

            assert.strictEqual(this.getImage().attr('alt'), 'New name');
        });

        QUnit.test('img element should have correct alt attribute if alt is empty', function(assert) {
            this.reinit({
                name: 'Test Name',
                url: 'url',
                alt: '',
            });

            assert.strictEqual(this.getImage().attr('alt'), 'Test Name');
        });

        QUnit.test('img element should have correct alt attribute if name is empty', function(assert) {
            this.reinit({
                name: '',
                url: 'url',
            });

            assert.strictEqual(this.getImage().attr('alt'), 'Avatar');
        });

        QUnit.test('img element should have correct src attribute', function(assert) {
            this.reinit({ url: 'url' });

            assert.strictEqual(this.getImage().attr('src'), 'url');
        });

        QUnit.test('img element should have correct src attribute if url was changed in runtime', function(assert) {
            this.reinit({ url: 'url' });
            this.instance.option({ url: 'New url' });

            assert.strictEqual(this.getImage().attr('src'), 'New url');
        });
    });
});
