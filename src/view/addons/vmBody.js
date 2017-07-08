import { ViewModelProto } from '../ViewModel';
import { isArr } from '../../utils';

export function nextSubVms(n, accum) {
	var body = n.body;

	if (isArr(body)) {
		for (var i = 0; i < body.length; i++) {
			var n2 = body[i];

			if (n2.vm != null)
				accum.push(n2.vm);
			else
				nextSubVms(n2, accum);
		}
	}

	return accum;
}