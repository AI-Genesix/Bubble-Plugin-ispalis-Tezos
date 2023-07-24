function(instance, properties) {

    let height = properties.bubble.height();
    let width = properties.bubble.width();

    let image = '//meta-l.cdn.bubble.io/f1687726066188x999913872204210700/ispalis.svg';

    if (height > width) {
        height = width
    } else if (width > height) {

        width = height
    }

    instance.canvas.append(`<div style="position: fixed; top: calc(50% - ${(height / 2).toFixed(0)}px); left: calc(50% - ${(width / 2).toFixed(0)}px); height: ${height}px; width: ${width}px; background-size: cover; background-position: center; background-image: url(${image})"></div>`)
}