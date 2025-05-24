import React, { useEffect, useState } from 'react';

const WilayahSelector = ({ formData, setFormData }) => {
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);

  useEffect(() => {
    fetchProvinsi();
  }, []);

  useEffect(() => {
    if (formData.provinsi_asal) fetchKabupaten(formData.provinsi_asal);
  }, [formData.provinsi_asal]);

  useEffect(() => {
    if (formData.kabupaten_asal) fetchKecamatan(formData.kabupaten_asal);
  }, [formData.kabupaten_asal]);

  useEffect(() => {
    if (formData.kecamatan_asal) fetchKelurahan(formData.kecamatan_asal);
  }, [formData.kecamatan_asal]);

  const fetchProvinsi = async () => {
    try {
      const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await res.json();
      setProvinsiList(data);
    } catch (error) {
      console.error("Gagal fetch provinsi", error);
    }
  };

  const fetchKabupaten = async (provId) => {
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`);
      const data = await res.json();
      setKabupatenList(data);
    } catch (error) {
      console.error("Gagal fetch kabupaten", error);
    }
  };

  const fetchKecamatan = async (kabId) => {
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`);
      const data = await res.json();
      setKecamatanList(data);
    } catch (error) {
      console.error("Gagal fetch kecamatan", error);
    }
  };

  const fetchKelurahan = async (kecId) => {
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecId}.json`);
      const data = await res.json();
      setKelurahanList(data);
    } catch (error) {
      console.error("Gagal fetch kelurahan", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "provinsi_asal" && { kabupaten_asal: "", kecamatan_asal: "", kelurahan_asal: "" }),
      ...(name === "kabupaten_asal" && { kecamatan_asal: "", kelurahan_asal: "" }),
      ...(name === "kecamatan_asal" && { kelurahan_asal: "" }),
    }));
  };

  return (
    <>
      {/* Provinsi */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Provinsi Asal</label>
        <select
          name="provinsi_asal"
          value={formData.provinsi_asal}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">Pilih Provinsi</option>
          {provinsiList.map((prov) => (
            <option key={prov.id} value={prov.id}>{prov.name}</option>
          ))}
        </select>
      </div>

      {/* Kabupaten */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Kabupaten/Kota Asal</label>
        <select
          name="kabupaten_asal"
          value={formData.kabupaten_asal}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">Pilih Kabupaten</option>
          {kabupatenList.map((kab) => (
            <option key={kab.id} value={kab.id}>{kab.name}</option>
          ))}
        </select>
      </div>

      {/* Kecamatan */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Kecamatan Asal</label>
        <select
          name="kecamatan_asal"
          value={formData.kecamatan_asal}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">Pilih Kecamatan</option>
          {kecamatanList.map((kec) => (
            <option key={kec.id} value={kec.id}>{kec.name}</option>
          ))}
        </select>
      </div>

      {/* Kelurahan */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Kelurahan Asal</label>
        <select
          name="kelurahan_asal"
          value={formData.kelurahan_asal}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md shadow-sm"
        >
          <option value="">Pilih Kelurahan</option>
          {kelurahanList.map((kel) => (
            <option key={kel.id} value={kel.id}>{kel.name}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default WilayahSelector;
