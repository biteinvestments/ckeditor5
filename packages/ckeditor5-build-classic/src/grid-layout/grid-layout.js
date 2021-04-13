import GridLayoutEditing from './grid-layout-editing';
import GridLayoutUI from './grid-layout-ui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class GridLayout extends Plugin {
    static get requires() {
        return [ GridLayoutEditing, GridLayoutUI ];
    }
}