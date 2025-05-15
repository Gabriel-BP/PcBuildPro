// backend_filter_adapters.js

function convertRangeToRegexMatch(field, range) {
    if (!Array.isArray(range)) return {};
    if (range[0] === range[1]) {
        return { [field]: { $regex: `^${range[0]}`, $options: 'i' } };
    } else {
        const options = [];
        for (let i = range[0]; i <= range[1]; i++) {
            options.push({ [field]: { $regex: `^${i}`, $options: 'i' } });
        }
        return { $or: options };
    }
}

function buildProcessorFilters(query) {
    const filters = {};
    if (query.processorBrand) {
        filters["Marca"] = { $regex: query.processorBrand, $options: 'i' };
    }
    if (query.enchufe) {
        filters["Características.Enchufe"] = { $regex: query.enchufe, $options: 'i' };
    }
    if (query.nucleos) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Núcleos", query.nucleos));
    }
    if (query.tdp) {
        Object.assign(filters, convertRangeToRegexMatch("Características.TDP", query.tdp));
    }
    if (query.reloj_base) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Reloj base", query.reloj_base));
    }
    return filters;
}

function buildGPUFilters(query) {
    const filters = {};
    if (query.gpuBrand) {
        filters["Marca"] = { $regex: query.gpuBrand, $options: 'i' };
    }
    if (query.memoria) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Memoria", query.memoria));
    }
    if (query.tdp) {
        Object.assign(filters, convertRangeToRegexMatch("Características.TDP", query.tdp));
    }
    if (query.longitud) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Longitud", query.longitud));
    }
    if (query.tipo_de_memoria) {
        filters["Características.Tipo de memoria"] = { $regex: query.tipo_de_memoria, $options: 'i' };
    }
    if (query.interfaz) {
        filters["Características.Interfaz"] = { $regex: query.interfaz, $options: 'i' };
    }
    return filters;
}

function buildMotherboardFilters(query) {
    const filters = {};
    if (query.motherboardSize) {
        filters["Características.Factor de forma"] = { $regex: query.motherboardSize, $options: 'i' };
    }
    if (query.ranuras_de_ram) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Ranuras de RAM", query.ranuras_de_ram));
    }
    if (query.ranuras_m2) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Ranuras M.2", query.ranuras_m2));
    }
    if (query.tipo_de_memoria) {
        filters["Características.Tipo de memoria"] = { $regex: query.tipo_de_memoria, $options: 'i' };
    }
    if (query.factor_de_forma) {
        filters["Características.Factor de forma"] = { $regex: query.factor_de_forma, $options: 'i' };
    }
    if (query.enchufe) {
        filters["Características.Enchufe"] = { $regex: query.enchufe, $options: 'i' };
    }
    if (query.redes_inalambricas) {
        filters["Características.Redes inalámbricas"] = query.redes_inalambricas === 'true' ? { $ne: "None" } : { $in: ["None", ""] };
    }
    return filters;
}

function buildMemoryFilters(query) {
    const filters = {};
    if (query.velocidad) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Velocidad", query.velocidad));
    }
    if (query.latencia_cas) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Latencia CAS", query.latencia_cas));
    }
    if (query.tipo_de_memoria) {
        filters["Características.Tipo de memoria"] = { $regex: query.tipo_de_memoria, $options: 'i' };
    }
    if (query.configuracion) {
        filters["Características.Configuración"] = { $regex: query.configuracion, $options: 'i' };
    }
    if (query.refrigeracion_pasiva) {
        filters["Características.Refrigeración pasiva"] = query.refrigeracion_pasiva === 'true' ? { $ne: "No" } : "No";
    }
    return filters;
}

function buildStorageFilters(query) {
    const filters = {};
    if (query.tipo_de_almacenamiento) {
        filters["Características.Tipo de almacenamiento"] = { $regex: query.tipo_de_almacenamiento, $options: 'i' };
    }
    if (query.capacidad) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Capacidad", query.capacidad));
    }
    if (query.interfaz) {
        filters["Características.Interfaz"] = { $regex: query.interfaz, $options: 'i' };
    }
    if (query.factor_de_forma) {
        filters["Características.Factor de forma"] = { $regex: query.factor_de_forma, $options: 'i' };
    }
    if (query.compatibilidad_con_nvme) {
        filters["Características.Compatibilidad con NVMe"] = query.compatibilidad_con_nvme === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    return filters;
}

function buildPSUFilters(query) {
    const filters = {};
    if (query.potencia) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Potencia", query.potencia));
    }
    if (query.calificacion_de_eficiencia) {
        filters["Características.Calificación de eficiencia"] = { $regex: query.calificacion_de_eficiencia, $options: 'i' };
    }
    if (query.modular) {
        filters["Características.Modular"] = query.modular === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    if (query.factor_de_forma) {
        filters["Características.Factor de forma"] = { $regex: query.factor_de_forma, $options: 'i' };
    }
    if (query.longitud) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Longitud", query.longitud));
    }
    return filters;
}

function buildCaseFilters(query) {
    const filters = {};
    if (query.longitud_maxima_de_gpu) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Longitud máxima de GPU", query.longitud_maxima_de_gpu));
    }
    if (query.factores_de_forma) {
        filters["Características.Factores de forma"] = { $regex: query.factores_de_forma, $options: 'i' };
    }
    if (query.ranuras_de_expansion) {
        filters["Características.Ranuras de expansión de altura completa"] = { $regex: query.ranuras_de_expansion, $options: 'i' };
    }
    return filters;
}

function buildCoolerFilters(query) {
    const filters = {};
    if (query.ruido_maximo) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Ruido máximo", query.ruido_maximo));
    }
    if (query.rpm_maximas) {
        Object.assign(filters, convertRangeToRegexMatch("Características.RPM máximas", query.rpm_maximas));
    }
    if (query.refrigerado_por_agua) {
        filters["Características.Refrigerado por agua"] = query.refrigerado_por_agua === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    if (query.sin_ventilador) {
        filters["Características.Sin ventilador"] = query.sin_ventilador === 'true' ? { $regex: /si|sí|yes|true/i } : { $regex: /no|false/i };
    }
    if (query.longitud_del_radiador) {
        Object.assign(filters, convertRangeToRegexMatch("Características.Longitud del radiador", query.longitud_del_radiador));
    }
    return filters;
}

module.exports = {
    buildProcessorFilters,
    buildGPUFilters,
    buildMotherboardFilters,
    buildMemoryFilters,
    buildStorageFilters,
    buildPSUFilters,
    buildCaseFilters,
    buildCoolerFilters,
};
