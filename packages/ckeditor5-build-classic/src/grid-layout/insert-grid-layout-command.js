import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InsertGridLayoutCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <gridLayout>*</gridLayout> at the current selection position
            // in a way that will result in creating a valid model structure.
            this.editor.model.insertContent( creategridLayout( writer ) );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition(), 'gridLayout' );

        this.isEnabled = allowedIn !== null;
    }
}

function creategridLayout( writer ) {
    const gridLayout = writer.createElement( 'gridLayout' );
    const gridLayoutDescription = writer.createElement( 'gridLayoutDescription' );
    const gridLayoutDescription2 = writer.createElement( 'gridLayoutDescription' );

    writer.append( gridLayoutDescription, gridLayout );
    writer.append( gridLayoutDescription2, gridLayout );

    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement( 'paragraph', gridLayoutDescription );
    writer.appendElement( 'paragraph', gridLayoutDescription2 );

    return gridLayout;
}