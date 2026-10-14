// db.js — Configuración de IndexedDB local para la PWA Offline-First

const db = new Dexie("BoutiquePOS_DB");

// Definición de tablas locales
db.version(1).stores({
    products: 'id, name, barcode, sku, category_id, is_active',
    sales: 'id, local_sale_id, synced, created_at',
    sync_queue: '++id, action, entity, payload, created_at',
    settings: 'key'
});

// Función para guardar una venta local en la cola de sincronización
async function saveSaleOffline(saleData) {
    const localSaleId = 'LOCAL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const record = {
        ...saleData,
        local_sale_id: localSaleId,
        synced: false,
        created_at: new Date().toISOString()
    };

    await db.sales.add(record);
    await db.sync_queue.add({
        action: 'CREATE_SALE',
        entity: 'sales',
        payload: record,
        created_at: new Date().toISOString()
    });

    return localSaleId;
}
