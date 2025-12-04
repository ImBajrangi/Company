# Quick Reference: Firestore Query Patterns

## ✅ Safe Query Patterns (No Index Required)

### 1. Single Where Clause
```javascript
query(collection(db, "orders"), 
    where("shopId", "==", shopId)
)
```

### 2. Single Where + OrderBy on Same Field
```javascript
query(collection(db, "orders"), 
    where("status", "==", "new"), 
    orderBy("status", "desc")  // Same field as where
)
```

### 3. Multiple Where on Equality (No OrderBy)
```javascript
query(collection(db, "orders"), 
    where("shopId", "==", shopId),
    where("status", "==", "new")
)
```

---

## ⚠️ Requires Composite Index

### 1. Where + OrderBy on Different Fields
```javascript
// ❌ Requires index: (userId, createdAt)
query(collection(db, "notifications"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
)
```

### 2. Multiple Where + OrderBy
```javascript
// ❌ Requires index: (shopId, role, createdAt)
query(collection(db, "notifications"), 
    where("shopId", "==", shopId),
    where("role", "==", role),
    orderBy("createdAt", "desc")
)
```

### 3. Multiple Where + OrderBy on Third Field
```javascript
// ❌ Requires index: (shopId, status, createdAt)
query(collection(db, "orders"), 
    where("shopId", "==", shopId),
    where("status", "in", ["new", "preparing"]),
    orderBy("createdAt", "asc")
)
```

---

## 🔧 Workaround: Local Sorting

**When to use:** Small result sets (< 100 documents)

### Pattern
```javascript
// 1. Query without orderBy
const q = query(
    collection(db, "notifications"), 
    where("shopId", "==", shopId),
    where("role", "==", role),
    limit(20)  // Keep limit small
);

// 2. Sort locally after fetching
onSnapshot(q, (snapshot) => {
    let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort in memory
    docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    
    // Use sorted data
    updateUI(docs);
});
```

**Benefits:**
- No index setup required
- Faster development
- Works immediately
- Cost-effective for small datasets

**Trade-offs:**
- Slight client-side overhead (usually < 1ms for 20-50 docs)
- Not suitable for large result sets (> 100 docs)

---

## 📊 Performance Comparison

| Documents | Local Sort Time | Index Query Time | Recommendation |
|-----------|----------------|------------------|----------------|
| 10        | < 0.1ms        | ~5ms             | Local Sort     |
| 20        | < 0.5ms        | ~5ms             | Local Sort     |
| 50        | ~1ms           | ~10ms            | Either         |
| 100       | ~2ms           | ~15ms            | Either         |
| 500       | ~10ms          | ~25ms            | Use Index      |
| 1000+     | ~20ms+         | ~30ms            | Use Index      |

---

## 🎯 Best Practices

### 1. Start Simple
```javascript
// Start with minimal query
const q = query(collection(db, "orders"), where("shopId", "==", shopId));

// Add sorting/filtering in code
const sorted = orders.sort((a, b) => b.timestamp - a.timestamp);
const filtered = sorted.filter(o => o.status === 'new');
```

### 2. Use Indexes for Large Datasets
```javascript
// For pagination or large result sets, use proper indexes
const q = query(
    collection(db, "orders"), 
    where("shopId", "==", shopId),
    orderBy("createdAt", "desc"),
    limit(50)
);
// Then create the required Firestore index
```

### 3. Combine Approaches
```javascript
// Use index for primary sorting
const q = query(
    collection(db, "orders"), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(100)
);

// Use local filtering for additional criteria
onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(o => o.status !== 'cancelled'); // Local filter
});
```

---

## 🚀 Quick Tips

1. **Limit first, sort later** - Always use `limit()` before sorting locally
2. **Check result size** - If > 100 docs, consider using an index
3. **Profile in production** - Monitor query performance in Firebase Console
4. **Document indexes** - Keep track of which queries need indexes for deployment
5. **Test offline** - Firestore caching works better with simpler queries

---

## 📝 Common Patterns in This App

### Customer Order Tracking
```javascript
// Uses index (documented)
query(collection(db, "orders"), 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc"), 
    limit(1)
)
```

### Staff Notifications
```javascript
// Uses local sorting (no index needed)
query(collection(db, "notifications"), 
    where("shopId", "==", shopId),
    where("role", "==", role),
    limit(20)
)
// + sort locally by createdAt
```

### Fast Order Monitor
```javascript
// Simplified query (no index needed)
query(collection(db, "orders"), 
    where("shopId", "==", shopId)
)
// + filter locally by status
```

---

## 🔗 Resources

- [Firestore Query Documentation](https://firebase.google.com/docs/firestore/query-data/queries)
- [Index Management](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Query Performance](https://firebase.google.com/docs/firestore/best-practices)
