import { Action, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';

export enum APISnapshotChangeType {
	ADD = 'ADD',
	REMOVE = 'REMOVE',
	EDIT = 'EDIT',
	MERGE = 'MERGE',
	NOT_EXIST = 'NOT_EXIST',
	NOT_RECOGNIZED = 'NOT_RECOGNIZED',
}

/**
 * Convert action firestore action to a more in-app recognizable.
 * This is the start of the firestore wrapper
 *
 * @param docSnapshot A document received from firestore
 * @returns TYPE will be the default string if not recognized. DOC will be undfined if the type is NOT_EXIST
 */
export function firestoreSnapshotAdapter<T>(
	docSnapshot: Action<DocumentSnapshot<unknown>> | DocumentChangeAction<unknown>,
): Snapshot<T> | EmptySnapshot {
	if (isInstanceOfFirestoreDocChange(docSnapshot)) {
		if (!docSnapshot.payload.doc.exists) {
			return {
				type: APISnapshotChangeType.NOT_EXIST,
				doc: undefined,
			};
		}
		switch (docSnapshot.type) {
			case 'added':
				return {
					type: APISnapshotChangeType.ADD,
					doc: docSnapshot.payload.doc.data() as T,
				};
			case 'modified':
				return {
					type: APISnapshotChangeType.EDIT,
					doc: docSnapshot.payload.doc.data() as T,
				};
			case 'removed':
				return {
					type: APISnapshotChangeType.REMOVE,
					doc: docSnapshot.payload.doc.data() as T,
				};
			default:
				console.warn('firestoreDocChangeAdapter ==>', 'Does not recognize type');
				return {
					type: APISnapshotChangeType.NOT_RECOGNIZED,
					doc: undefined,
					// doc: docSnapshot.payload.doc.data() as T,
				};
		}
	} else {
		if (!docSnapshot.payload.exists) {
			return {
				type: APISnapshotChangeType.NOT_EXIST,
				doc: undefined,
			};
		}
		switch (docSnapshot.type) {
			case 'value':
				return {
					type: APISnapshotChangeType.MERGE,
					doc: docSnapshot.payload.data() as T,
				};
			default:
				console.warn('firestoreDocSnapshotTypeAdapter ==>', 'Does not recognize type');
				return {
					type: APISnapshotChangeType.NOT_RECOGNIZED,
					doc: undefined,
					// doc: docSnapshot.payload.data() as T,
				};
		}
	}
}

function isInstanceOfFirestoreDocChange(
	docSnapshot: Action<DocumentSnapshot<unknown>> | DocumentChangeAction<unknown>,
): docSnapshot is DocumentChangeAction<unknown> {
	return 'doc' in docSnapshot.payload;
}

export type Snapshot<T> = DocSnapshot<T> | EmptySnapshot;
export interface DocSnapshot<T> {
	type: Exclude<APISnapshotChangeType, APISnapshotChangeType.NOT_EXIST | APISnapshotChangeType.NOT_RECOGNIZED>;
	doc: T;
}
export interface EmptySnapshot {
	type: APISnapshotChangeType.NOT_EXIST | APISnapshotChangeType.NOT_RECOGNIZED;
	doc: undefined;
}
