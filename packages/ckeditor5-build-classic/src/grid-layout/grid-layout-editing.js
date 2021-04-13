import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import InsertGridLayoutCommand from './insert-grid-layout-command'; 

export default class GridLayoutEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }
    init() {

        this._defineSchema();

        this._defineConverters()

        this.editor.commands.add('insertGridLayout', new InsertGridLayoutCommand(this.editor))

    }
    _defineSchema() {
        const schema = this.editor.model.schema

        schema.register('gridLayout', {
            // Behaves like a self-contained object (e.g. an image).
            isObject: true,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block'
        });


        schema.register( 'gridLayoutDescription', {
            // Cannot be split or left by the caret.
            isLimit: true,

            allowIn: 'gridLayout',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root'
        } );

        // Now the command should be disabled also when the selection is inside the description of another simple box instance.

        schema.addChildCheck( ( context, childDefinition ) => {
            if ( context.endsWith( 'gridLayoutDescription' ) && (childDefinition.name == 'gridLayout' || childDefinition.name == 'insertTable') ) {
                return false;
            }
        } );


    }


    _defineConverters() {
        const conversion = this.editor.conversion;


        conversion.for( 'upcast' ).elementToElement( {
            model: 'gridLayout',
            view: {
                name: 'section',
                classes: 'grid-layout'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'gridLayout',
            view: {
                name: 'section',
                classes: 'grid-layout'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'gridLayout',
            view: ( modelElement, { writer: viewWriter } ) => {
                const section = viewWriter.createContainerElement( 'section', { class: 'grid-layout' } );

                return toWidget( section, viewWriter, { label: 'grid layout widget' } );
            }
        } );



        conversion.for( 'upcast' ).elementToElement( {
            model: 'gridLayoutDescription',
            view: {
                name: 'div',
                classes: 'grid-layout-description'
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'gridLayoutDescription',
            view: {
                name: 'div',
                classes: 'grid-layout-description'
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'gridLayoutDescription',
            view: ( modelElement, { writer: viewWriter } ) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement( 'div', { class: 'grid-layout-description' } );

                return toWidgetEditable( div, viewWriter );
            }
        } );
    }

}