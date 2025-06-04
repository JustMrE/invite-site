// /js/logic/relations.js
import { db } from "../firebase.js";

// TODO: можно расширить поддержку связей
export async function syncGuestRelations(id) {
  const snapshot = await db.ref(`guests/${id}`).once("value");
  const guest = snapshot.val();
  if (!guest || !guest.relations) return;

  const updates = [];

  // Пример: wife/husband/children
  for (const [relationType, value] of Object.entries(guest.relations)) {
    if (Array.isArray(value)) {
      for (const childId of value) {
        updates.push(linkRelation(childId, id, "parent"));
      }
    } else {
      updates.push(linkRelation(value, id, reverseType(relationType)));
    }
  }

  return Promise.all(updates);
}

function reverseType(type) {
  switch (type) {
    case "husband": return "wife";
    case "wife": return "husband";
    case "parent": return "children";
    case "children": return "parent";
    default: return type;
  }
}

function linkRelation(targetId, id, reverseType) {
  return db.ref(`guests/${targetId}/relations`).once("value").then(snapshot => {
    const rel = snapshot.val() || {};

    if (reverseType === "children") {
      rel.children = rel.children || [];
      if (!rel.children.includes(id)) rel.children.push(id);
    } else {
      rel[reverseType] = id;
    }

    return db.ref(`guests/${targetId}/relations`).update(rel);
  });
}
