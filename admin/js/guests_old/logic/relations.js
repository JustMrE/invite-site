import { db } from "../firebase.js";

// Карта обратных связей
const reverseRelationMap = {
  spouse: "spouse",
  parent: "children",
  children: "parent",
};

export function syncGuestRelations(id, type, relatedId) {
  const reverseType = reverseRelationMap[type];
  if (!reverseType) return Promise.resolve();

  return db
    .ref(`guests/${id}/relations`)
    .once("value")
    .then((snapshot) => {
      const rel = snapshot.val() || {};
      if (type === "children") {
        rel.children = rel.children || [];
        if (!rel.children.includes(relatedId)) rel.children.push(relatedId);
      } else {
        rel[type] = relatedId;
      }
      return db.ref(`guests/${id}/relations`).update(rel);
    })
    .then(() => {
      return db
        .ref(`guests/${relatedId}/relations`)
        .once("value")
        .then((snapshot) => {
          const rel = snapshot.val() || {};
          if (reverseType === "children") {
            rel.children = rel.children || [];
            if (!rel.children.includes(id)) rel.children.push(id);
          } else {
            rel[reverseType] = id;
          }
          return db.ref(`guests/${relatedId}/relations`).update(rel);
        });
    });
}
