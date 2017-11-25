// h/t @bfred-it/intrinsic-scale: https://github.com/bfred-it/intrinsic-scale/blob/master/index.js
// n.b. could not import this due to e-cli restrictions; follow issue at https://github.com/ember-cli/rfcs/issues/84

function fit(contains) {
	return (parentWidth, parentHeight, childWidth, childHeight) => {
		const doRatio = childWidth / childHeight;
		const cRatio = parentWidth / parentHeight;
		let width = parentWidth;
		let height = parentHeight;

		if (contains ? (doRatio > cRatio) : (doRatio < cRatio)) {
			height = width / doRatio;
		} else {
			width = height * doRatio;
		}

		return {
			width,
			height,
			x: (parentWidth - width) / 2,
			y: (parentHeight - height) / 2
		};
	};
}

export const contain = fit(true);
export const cover = fit(false);
