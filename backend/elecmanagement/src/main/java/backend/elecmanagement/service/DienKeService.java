package backend.elecmanagement.service;

import backend.elecmanagement.entity.DienKe;

import java.util.List;
import java.util.Optional;

public interface DienKeService {
    List<DienKe> findAll();
    Optional<DienKe> findById(String id);
    DienKe save(DienKe dienKe);
    void delete(String id);
}
